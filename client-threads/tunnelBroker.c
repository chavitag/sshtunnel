/** tunnelBroker.c
		NEEDS: 	setcap cap_net_raw+ipe tunnelBroker
		to enable "ping" to computers without root privileges
*/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>
#include <errno.h>
#include <ctype.h>
#include <time.h>
#include <errno.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <arpa/inet.h>
#include <sys/file.h>
#include <syslog.h>
#include <pthread.h>

#include <sys/stat.h>
#include <sys/poll.h>
#include <sys/ioctl.h>
#include <unistd.h>

#include <fcntl.h>

#include "threads.h"
#include "http.h"
#include "computer.h"
#include "tunnel.h"
#include "json.h"

#define true 1
#define false 0

#define IP "127.0.0.1"
#define PORT 1777 
#define TIMERENEW	600
#define REQUEST  "http://%s/service?apikey=api-key-tunnel"
// #define RESPONSE "http://sshtunnel.xavitag.es/service?do=update&apikey=api-key-tunnel"

#define PIPEREAD __pipefd[0]
#define PIPEWRITE __pipefd[1]

#define PIPECOMMREAD __pipeComm[0]
#define PIPECOMMWRITE __pipeComm[1]

char __request[256];
int __pipefd[2];  // 0 reading, 1 writing
int __pipeComm[2];	
pid_t __whoami;	// 0, son. PID_SON, father
int __quit=0; 

int processTunnels(JSONDATA *jstunnels);
int processComputers(JSONDATA *jscomputers);
int doCommand(JSONDATA *action);
DString *JSON_response(JSONDATA *jscomputers);
void notify_end(int signal);
void testRenew();
void renewData(void);
char *process(char *data,int size);
void *doWork(int idthread,void *skd_addr);
void waitRequests(int port);

#define TUNNEL_COMMAND_SET 0
#define TUNNEL_COMMAND_GET 1

/** cleanPipe
		Cleans a communications input pipe from initial forked process reading remaining data
		MUST BE LOCKED (Thread Sync)
*/
int cleanPipe(int pipe) {
	int bytesread;

	ioctl(pipe, FIONREAD, &bytesread);  // How much bytes to read ??
	if (bytesread>0) {
		char kk[256];

		if (bytesread > 256) bytesread=256;
		read(PIPECOMMREAD,kk,bytesread);
		kk[255]=0;
		syslog(LOG_LOCAL7,"Trash In Input!!!!");
		syslog(LOG_LOCAL7,kk);
		return 1;
	}
	return 0;
}

/** threadCommandTunnel
		Execute a tunnel bash control command sending order by a communications pipe against intial forked process
		MUST BE LOCKED (Thread Sync)
*/
int threadCommandTunnel(Tunnel *t, int command) {
	char buffer[256];
	struct pollfd poll_set;
	int retpoll;
	long int running;

	switch(command) {
		case TUNNEL_COMMAND_SET:
			if (TUNNEL_STARTED(*t)) {
				snprintf(buffer,256,"TUNNEL*ON*0*%d*%s*%d",TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),TUNNEL_DESTPORT(*t));
			} else {
				snprintf(buffer,256,"TUNNEL*OFF*%d*%d*%s*%d",TUNNEL_MONITOR(*t),TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),TUNNEL_DESTPORT(*t));
			}
			break;
		case TUNNEL_COMMAND_GET:
				snprintf(buffer,256,"TUNNEL*GET*0*0*%s*0",TUNNEL_IP(*t));
			break;
	}
//Clear read...
	cleanPipe(PIPECOMMREAD);

	write(PIPEWRITE,buffer,strlen(buffer));
	poll_set.fd=PIPECOMMREAD;
	poll_set.events = POLLIN;
	running=1;
	retpoll=poll(&poll_set, 1, 5000);
	if (retpoll<0) syslog(LOG_LOCAL7,"Error %s\n",strerror(errno));
	else if (retpoll==1) {
		read(PIPECOMMREAD,&running,sizeof(running));
		if (t->started!=NULL) {
			if (running>0) {
				TUNNEL_STARTED(*t)=1;
				TUNNEL_MONITOR(*t)=running;
			} else if (running==0) {
				TUNNEL_STARTED(*t)=0;
				TUNNEL_MONITOR(*t)=0;
			}
		}
	} 
	return running;
}

/** processTunnels
		Process JSON Tunnel List
*/
int processTunnels(JSONDATA *jstunnels) {
	JSONDATA *tunnel;
	Tunnel t;
	int running;
	int started;

	tunnel=jstunnels;
	while(tunnel!=NULL) {
		if (parseTunnel(tunnel,&t)==NULL) return 1;
		started=TUNNEL_STARTED(t);
		if (__whoami==0) {
			running=getStatusTunnel(&t);
			if (!running && started) turnOnTunnel(&t);
			else if (running && !started) turnOffTunnel(&t);
		} else {

// Needs Lock 	
//
#ifdef WITHPTHREADS
	pthread_mutex_lock( &__mutexJSON );
#endif
			threadCommandTunnel(&t,TUNNEL_COMMAND_SET);

#ifdef WITHPTHREADS
	pthread_mutex_unlock( &__mutexJSON );
#endif

		}
		tunnel=tunnel->next;
	}
	return 0;
}

/** processComputers
		process JSON Computer List (keeps a internal computer list)
*/
int processComputers(JSONDATA *jscomputers) {
	JSONDATA *computer;
	JSONDATA *nextcomputer;
	Computer c;

#ifdef _DEBUG
printf("Processing Computers\n"); fflush(stdout);
#endif

	computer=jscomputers;
	while(computer!=NULL) {
		if (parseComputer(computer,&c)==NULL) return 1;
		nextcomputer=computer->next;
		cutNodeJson(computer);

// Needs Lock
//
#ifdef WITHPTHREADS
	pthread_mutex_lock( &__mutexJSON );
#endif
		registerComputer(computer,&c);
		if (COMPUTER_SCAN(c)) getStatusComputer(&c);

#ifdef WITHPTHREADS
	pthread_mutex_unlock( &__mutexJSON );
#endif
		computer=nextcomputer;
	}
	return 0;
}

/** doCommand
		Executes an action command (currently only "change-computer-status" to switch computer on/off)
*/
int doCommand(JSONDATA *action) {
	const char *command=NULL;
	const char *credentials=NULL;
	JSONDATA *ids;
	int id;
	int status;
	Computer c;
	JSONDATA *computer;
	int ret=1;

	while (action!=NULL) {
		if (strcmp(action->json_field,"id")==0) id=JSON_GET_INT(action);
		if (strcmp(action->json_field,"ids")==0) ids=JSON_GET_ARRAY(action);
		else if (strcmp(action->json_field,"command")==0) command=JSON_GET_STRING(action);
		else if (strcmp(action->json_field,"status")==0) status=JSON_GET_INT(action);
		else if (strcmp(action->json_field,"credentials")==0) credentials=JSON_GET_STRING(action);
		action=action->next;
	}
	if (strcmp(command,"change_tunnel_status")==0) {			// On/Off tunnel
		ret=0;
	} else if (strcmp(command,"kill")==0) {
		__quit=1;
		ret=0;
	} else if (strcmp(command,"delete_computers")==0) {		// Deletes computer from list
		Tunnel t;
		t.started=NULL;
		t.monitor=NULL;

// Needs Lock 
//	
#ifdef WITHPTHREADS
	pthread_mutex_lock( &__mutexJSON );
#endif
		ret=0;
		while(ids!=NULL) {
			id=JSON_GET_INT(ids);
			if ((computer=getComputer(id,&c))!=NULL) {
				t.ip=c.ip;
				if (!threadCommandTunnel(&t, TUNNEL_COMMAND_GET)) {
					cutNodeJson(computer);
					freeJson(computer);
				} else ret=2;
			}
			ids=JSON_NEXT(ids);
		}

#ifdef WITHPTHREADS
	pthread_mutex_unlock( &__mutexJSON );
#endif 

	} else if (strcmp(command,"change_computer_status")==0) {	// On/Off computer
		char buffer[256];
		struct timespec req;

// Needs Lock 	
//
#ifdef WITHPTHREADS
	pthread_mutex_lock( &__mutexJSON );
#endif
		if ((computer=getComputer(id,&c))!=NULL) {
			ret=0;
			getStatusComputer(&c);
			if (status) {
				if (COMPUTER_STATUS(c)==0) {	// On Computer
					snprintf(buffer,256,"COMPUTER*ON*%s*%d",COMPUTER_MAC(c),getpid());
					COMPUTER_STATUS(c)=STARTING;
					COMPUTER_STARTTIME(c)=time(NULL);
					status=strlen(buffer);
					if (write(PIPEWRITE,buffer,status)!=status) ret=1;
				}
			}	else	{	// Off Computer
				if ((credentials!=NULL)&&(getStatusComputer(&c)==RUNNING)) {
					snprintf(buffer,256,"COMPUTER*OFF*%s*%s",COMPUTER_IP(c),credentials);
					COMPUTER_STATUS(c)=SHUTTINGDOWN;
					status=strlen(buffer);
					if (write(PIPEWRITE,buffer,status)!=status) ret=1;
				}
			}
		}

#ifdef WITHPTHREADS
	pthread_mutex_unlock( &__mutexJSON );
#endif 
	}
	return ret;  
}

/** JSON_response
		Builds a tunnel and computer status JSON response 
*/
DString *JSON_response(JSONDATA *jstunnels) {
	DString *json;
	DString *temp;

	json=dstring("{\"ok\":true,\"computers\":");
	temp=JSON_ComputerList();

	json=dstrjoin(json,temp);
	dsfree(temp);

	json=dstrcat(json,", \"tunnels\":");
	temp=JSON_TunnelList(jstunnels);

	json=dstrjoin(json,temp);
	dsfree(temp);

	json=dstrcat(json,"}");
	return json;
}


/** notify_end
		Notifies child end
*/
void notify_end(int signal) {
	wait(NULL);
}


/** testRenew
		Renew info every TIMERENEW seconds and serve thread bash commands through communication
		pipe
*/
void testRenew() {
	int running;
	long int monitor;
	struct pollfd poll_set;
	int retpoll;
	int bytesread;
	char buffer[1024];
	time_t renewtime;

	onTunnel(62997,63000,"127.0.0.1",1777);		// Service tunnel

	memset(&poll_set, '\0', sizeof(poll_set));
	poll_set.fd = PIPEREAD;
	poll_set.events = POLLIN;

	renewData();	// Initial tunnel setting
	renewtime=time(NULL);
	while(1) {
		buffer[0]=0;
		retpoll=poll(&poll_set, 1, TIMERENEW*1000); // Wait command from threads TIMERENEW seconds max.
		if (retpoll<0) syslog(LOG_LOCAL7,"Error %s\n",strerror(errno));
		else if (retpoll==1) { // Received command
			ioctl(poll_set.fd, FIONREAD, &bytesread);  // How much bytes to read ??
			if (bytesread>1023) bytesread=1023;
			if (bytesread > 0) {
				char *token;
				char params[6][20];
				int pos=0;

				read(poll_set.fd,buffer,bytesread);
				buffer[bytesread]=0;

#ifdef __DEBUG
printf("Recibido comando de un thread %s\n",buffer); fflush(stdout);
#endif

				// Parsing Command
				token=strtok(buffer,"*");
				while((token!=NULL)&&(pos<6)) {
					params[pos][19]=0;
					strncpy(params[pos++],token,19);
					token=strtok(NULL,"*");
				}

				if (strcmp(params[0],"COMPUTER")==0) {	// Computer command
					if (strcmp(params[1],"ON")==0) {						// On computer
						switchOn(params[2]);
					} else {														// Off computer
						turnOffComputer(params[2],params[3]);
					}
				} else	if (strcmp(params[0],"TUNNEL")==0) {  // Tunnel command
					struct timespec ts;
					ts.tv_sec=0;
					ts.tv_nsec=999999;

					monitor=-1;
					// If command is not "get tunnel status", and is renew time, do renew....
					if ((strcmp(params[1],"GET")!=0)&&((time(NULL)-renewtime) > TIMERENEW)) {
						renewData();  // This change tunnel status...
						renewtime=time(NULL);
					} else {
						int sport=atoi(params[3]);
						int dport=atoi(params[5]);

						running=verifyTunnel(sport,params[4],&monitor,dport);		// Verify tunnel sttus
						if (strcmp(params[1],"ON")==0) {										// On Tunnel command
							if (!running) {
								monitor=getMonitorPort();
								if (monitor!=0) onTunnel(monitor,sport,params[4],dport);
							}
						} else if (strcmp(params[1],"OFF")==0) {							// Off Tunnel command
							if (running) offTunnel(monitor,sport,params[4],dport);
						}
						if (strcmp(params[1],"GET")!=0) {	// If command is not "get tunnel status", wait to complete tunnel action and gets status again
							nanosleep(&ts,NULL);
							running=verifyTunnel(sport,params[4],&monitor,dport);
						}
					}
					write(PIPECOMMWRITE,&monitor,sizeof(monitor));	// Send tunnel status to calling thread
				}
			}
		} else {  // Automatic renew tunnels
			running=verifyTunnel(63000,"127.0.0.1",&monitor,1777);	// Service tunnel
			if (!running) onTunnel(62997,63000,"127.0.0.1",1777);
			renewData();	// User's tunnels
			renewtime=time(NULL);
		}
	}
}

/** renewData
		Refresh user's tunnel status
*/
void renewData(void) {
	unsigned long size;
	char *info;
	JSONDATA *jobj;
	JSONDATA *jstunnels;

	syslog(LOG_LOCAL7,"Refreshing tunnels...");
	info=http_request(__request,NULL,&size);	// Getting tunnels status from server
	if (info!=NULL) {
		// syslog(LOG_LOCAL7,info);
		jobj=parseJson(info);

		if (jobj!=NULL) {
			jstunnels=getNodeJson(jobj,"ok");
			if ((jstunnels!=NULL)&&(JSON_GET_BOOLEAN(jstunnels))) {
				jstunnels=getNodeJson(jobj,"tunnels");
				jstunnels=cutNodeJson(jstunnels); // Cut tunnels
				freeJson(jobj); 
				processTunnels(JSON_GET_ARRAY(jstunnels)); 
				freeJson(jstunnels);
			} else	freeJson(jobj);
		}
		free(info);
	}
}

/** process
		process received JSON data command
*/
char *process(char *data,int size) {
	JSONDATA *jobj;
	JSONDATA *ok;
	JSONDATA *jsaction;
	JSONDATA *jstunnels;
	JSONDATA *jscomputers;
	DString *retval;
	int code;

	jobj=parseJson(data);
	if (jobj!=NULL) {
		ok=getNodeJson(jobj,"ok");
		if ((ok!=NULL)&&(JSON_GET_BOOLEAN(ok))) {
			jsaction=getNodeJson(jobj,"action");	// Action command
			if (jsaction!=NULL)	jsaction=cutNodeJson(JSON_GET_OBJECT(jsaction));

			jstunnels=getNodeJson(jobj,"tunnels"); // Tunnel list
			if ((jstunnels!=NULL)&&(JSON_GET_ARRAY(jstunnels)!=NULL)) jstunnels=cutNodeJson(JSON_GET_ARRAY(jstunnels));
			else jstunnels=NULL;

			jscomputers=getNodeJson(jobj,"computers"); // Computer list
			if ((jscomputers!=NULL)&&(JSON_GET_ARRAY(jscomputers)!=NULL)) jscomputers=cutNodeJson(JSON_GET_ARRAY(jscomputers));
			else jscomputers=NULL;

			freeJson(jobj);

			if (jscomputers!=NULL) {	// Processing computer list: Add computers to local computer list and update their status if necessary
				code=processComputers(jscomputers);
				if (code!=0) return "{\"ok\":false,\"msg\":\"Error processing computers\"}";
			}

			if (jstunnels!=NULL) {	// Processing tunnel list: On and Off tunnels
				code=processTunnels(jstunnels);
				if (code!=0) return "{\"ok\":false,\"msg\":\"Error processing tunnels\"}";
			}

			if (jsaction!=NULL) {	// Processing user command
				code=doCommand(jsaction);
				if (code!=0) {
					switch(code) {
						case 1: return "{\"ok\":false,\"msg\":\"Error processing command\"}";
						case 2: return "{\"ok\":false,\"msg\":\"Algún equipo ten túneis activos\"}";
					}
				}
				freeJson(jsaction);
			} 
			retval=JSON_response(jstunnels);	// Making response
			strncpy(data,DSTR_STRING(retval),size);
			dsfree(retval);

			freeJson(jstunnels);
			return data;
		}
	}
	return "{\"ok\":false,\"msg\":\"Bad Command\"}";
}

/** doWork
		read and process client's requests from server
*/
void *doWork(int idthread,void *skd_addr) {
	char bufrcv[1000000];
	char *response;
	char *errmsg="{\"ok\":false,\"msg\":\"Out of Buffer\"}";
	long int skd=(long int)skd_addr;
	int flag = 1; 

	fcntl (skd, F_SETFD, FD_CLOEXEC);
	pthread_detach(pthread_self()); // No join...

	// reads JSON command from server
	int nc=recv(skd,bufrcv,sizeof(bufrcv)-1,0);
	if (nc>0) { 
		bufrcv[nc]=0;

#ifdef _DEBUG
printf("Recibida petición: %s\n",bufrcv); fflush(stdout);
#endif

		response=process(bufrcv,sizeof(bufrcv));	// processing request
		setsockopt(skd, IPPROTO_TCP, TCP_NODELAY, (char *) &flag, sizeof(int));
		if (response!=NULL)	flag=send(skd,response,strlen(response),0);	// send response
		else		    			flag=send(skd,errmsg,strlen(errmsg),0);
		if (flag==-1) { // check error
			syslog(LOG_LOCAL7,"Error enviando datos");
			syslog(LOG_LOCAL7,strerror(errno));
		} else {
			snprintf(bufrcv,sizeof(bufrcv),"Total datos: %d, Enviados: %d\n",strlen(response),flag);
			syslog(LOG_LOCAL7,bufrcv,strlen(bufrcv));
		}
	} else syslog(LOG_LOCAL7,"Error recibiendo petición");
	close(skd);
}
 
/** waitRequests
		Wait for client's requests in communications socket by service tunnel
*/
void waitRequests(int port) {
	int sk;
	char *errmsg="{\"ok\":false,\"msg\":\"I'm busy, can't process this request\"}";

	if (pipe(__pipefd)==-1) {	// PIPEREAD/PIPEWRITE -> thread sends command to service process
		syslog(LOG_LOCAL7,"Pipe creation failed\n");
		exit(0);
	}

	if (pipe(__pipeComm)==-1) { // PIPECOMMREAD/PIPECOMMWRITE  -> service process send information to a thread
		syslog(LOG_LOCAL7,"Communication pipe creation failed\n");
		close(__pipefd[0]);
		close(__pipefd[1]);
		exit(0);
	}

	signal(SIGCHLD, notify_end); 
	__whoami=fork();	// fork!! -> father wait commands from server and create thread service, son renew status tunnels and serve thread commands
	switch(__whoami) {
		case 0: 
			// Son
			//
			close(PIPEWRITE); // Only reading
			close(PIPECOMMREAD); // Only Writing
			signal(SIGCHLD, notify_end); 
			testRenew(); 
			close(PIPEREAD);
			close(PIPECOMMWRITE);
			exit(0); 
		case -1: 
			syslog(LOG_LOCAL7,"Error forking %s\n",strerror(errno));
			exit(0);
	}
	// Father
	//
	close(PIPEREAD); // Only writing
	close(PIPECOMMWRITE); // Only read
	sk=socket(PF_INET,SOCK_STREAM,0);
	if (sk!=-1) {
		struct sockaddr_in addr;
		struct hostent *he;
		long int skd;
		int sz;

		addr.sin_family=AF_INET;
		addr.sin_port=htons(port);
		addr.sin_addr.s_addr=inet_addr(IP);
		if (bind(sk,(struct sockaddr *)&addr,sizeof(addr))!=-1) {
			if (listen(sk,5)!=-1) {
				sz=sizeof(addr);
				while(!__quit) {
#ifdef _DEBUG
	printf("Waiting for connection: "); fflush(stdout);
#endif
					skd=accept(sk,(struct sockaddr *)&addr,&sz);
					if (skd!=-1) {
						if (newThread(doWork,(void *)skd)<0) {	// Create service thread
							syslog(LOG_LOCAL7,"ERROR thread create");
							send(skd,errmsg,strlen(errmsg),0);
							close(skd);
						}
					} else syslog(LOG_LOCAL7,"ERROR Acepting connection!!!\n");
				}
			}
		} else syslog(LOG_LOCAL7,"Can't bind address\n");
		close(sk);
	} else syslog(LOG_LOCAL7,"Can't open socket\n");
	if (joinThreads()!=0) syslog(LOG_LOCAL7,"ERROR IN THREAD");
	freeComputers();
	kill(__whoami,SIGKILL);
	close(PIPEWRITE);
	close(PIPECOMMREAD);
}


/** MAIN: Background process
*/
void main(int argc,char *argv[]) {
	pid_t pid, sid;
	int logfile;

	if (argc<2) {
		printf("tunnelBroker url\n");
		exit(0);
	}
	snprintf(__request,sizeof(__request),REQUEST,argv[1]);

#ifndef _DEBUG
	
	if ((pid=fork())==-1)  {
		exit(EXIT_FAILURE); 	 
	}
	if (pid!=0) exit(EXIT_SUCCESS);
	umask(0);
	sid = setsid();
	if (sid < 0) {
		syslog(LOG_LOCAL7,"Error setsid %s\n",strerror(errno));
		exit(EXIT_FAILURE);
	}
	
	close(STDOUT_FILENO);
	close(STDERR_FILENO);

#endif
	waitRequests(PORT);
	exit(EXIT_SUCCESS);		    
}
