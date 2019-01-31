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
#include <arpa/inet.h>
#include <sys/file.h>
#include <syslog.h>

#include <sys/stat.h>
#include <fcntl.h>
#include <json.h>
#include <json_object.h>

#include "http.h"
#include "computer.h"
#include "tunnel.h"

#define true 1
#define false 0

#define IP "127.0.0.1"
#define PORT 1777 
#define TIMERENEW	600
#define REQUEST  "http://%s/service?apikey=api-key-tunnel"
// #define RESPONSE "http://sshtunnel.xavitag.es/service?do=update&apikey=api-key-tunnel"

void doWork(int skd,struct sockaddr_in *addr);
void notify_end(int signal);
void waitRequests(int port);
void testRenew(void);
void renewData(void);
char *process(char *data);

char __request[256];
char __bufrcv[1000000];
char __bufsnd[1000000];

char *JSON_response(void);
void renewData(void);

void processTunnels(json_object *jstunnels) {
	json_object *el;
	json_object *obj;
	unsigned int id;
	unsigned short sport;
	unsigned short dport;
	const char *ip;
	int status;
	const char *url;
	Tunnel *t;
	int running;
	int idx;

	int len=json_object_array_length(jstunnels);

	for(idx=0;idx<len;idx++) {
		el=json_object_array_get_idx(jstunnels,idx);

		json_object_object_get_ex(el,"id",&obj);
		id=json_object_get_int(obj);

		t=getTunnel(id);
		if (t==NULL) {
			json_object_object_get_ex(el,"sourceport",&obj);
			sport=json_object_get_int(obj);

			json_object_object_get_ex(el,"destport",&obj);
			dport=json_object_get_int(obj);

			json_object_object_get_ex(el,"ip",&obj);
			ip=json_object_get_string(obj);

			t=newTunnel(id,sport,dport,ip);
		}
		json_object_object_get_ex(el,"started",&obj);
		status=json_object_get_boolean(obj);
		running=getStatusTunnel(t);

		if (!running && status) turnOnTunnel(t);
		else if (running && !status) turnOffTunnel(t);
	}
}

void processComputers(json_object *jscomputers) {
	json_object *el;
	json_object *obj;
	unsigned int id;
	const char *dn;
	const char *ip;
	const char *desc;
	const char *mac;
	time_t startTime;
	Computer *c;
	int idx;

	int len=json_object_array_length(jscomputers);

	for (idx=0;idx<len;idx++) {
		el=json_object_array_get_idx(jscomputers,idx);

		json_object_object_get_ex(el,"id",&obj);
		id=json_object_get_int(obj);

		json_object_object_get_ex(el,"domainname",&obj);
		dn=json_object_get_string(obj);

		json_object_object_get_ex(el,"ip",&obj);
		ip=json_object_get_string(obj);

		json_object_object_get_ex(el,"description",&obj);
		desc=json_object_get_string(obj);

		json_object_object_get_ex(el,"mac",&obj);
		mac=json_object_get_string(obj);

		if (json_object_object_get_ex(el,"startTime",&obj))
			startTime=json_object_get_int(obj);
		else 
			startTime=0;
		c=getComputer(id);
		if (c==NULL) c=newComputer(id,dn,ip,desc,mac,startTime);
		else    {
			strncpy(c->domainname,dn,127);
			strncpy(c->ip,ip,15);
			strncpy(c->description,desc,127);
			strncpy(c->mac,mac,17);
			c->startedTime=startTime;
		}
		getStatusComputer(c);
	}
}

void doCommand(json_object *jsaction) {
	json_object *obj;
	const char *command;
	int id;
	int status;
	Computer *c;
	Tunnel *t;

	if (jsaction!=NULL) {
		json_object_object_get_ex(jsaction,"id",&obj);
		id=json_object_get_int(obj);

		json_object_object_get_ex(jsaction,"command",&obj);
		command=json_object_get_string(obj);

		json_object_object_get_ex(jsaction,"status",&obj);
		status=json_object_get_boolean(obj);

		if (strcmp(command,"change_computer_status")==0) {
			c=getComputer(id);
			if (c!=NULL) {
				if (status) {
					turnOnComputer(c);
				} else {
					json_object_object_get_ex(jsaction,"credentials",&obj);
					turnOffComputer(c,json_object_get_string(obj));
				}
			} 
		} /*else if (strcmp(command,"change_tunnel_status")==0) {
			t=getTunnel(id);
			if (t!=NULL) {
				if (status) {
					turnOnTunnel(t);
				} else {
					turnOffTunnel(t);
				}
			}
		}*/
	}
}

char *process(char *data) {
	json_object *jobj;
	json_object *jsaction=NULL;
	json_object *jstunnels=NULL;
	json_object *jscomputers=NULL;
	json_object *ok=NULL;

	jobj = json_tokener_parse(data);
	if (json_object_object_get_ex(jobj,"ok",&ok) && json_object_get_boolean(ok)) {
		json_object_object_get_ex(jobj, "action",&jsaction);
		json_object_object_get_ex(jobj, "tunnels",&jstunnels);
		json_object_object_get_ex(jobj, "computers",&jscomputers);

		if (jscomputers!=NULL) processComputers(jscomputers);
		if (jstunnels!=NULL) processTunnels(jstunnels);
		doCommand(jsaction);
	}
	return JSON_response();
}

char *JSON_response(void) {
	int len;
	strcpy(__bufsnd,"{\"ok\":true,\"computers\":");
	len=strlen(__bufsnd);
	JSON_ComputerList(&__bufsnd[len],sizeof(__bufsnd)-len);
	len=strlen(__bufsnd);
	strncat(__bufsnd,",\"tunnels\":",sizeof(__bufsnd)-len);
	len=strlen(__bufsnd);
	JSON_TunnelList(&__bufsnd[len],sizeof(__bufsnd)-len);
	len=strlen(__bufsnd);
	strncat(__bufsnd,"}",sizeof(__bufsnd)-len);
	return __bufsnd;
}

void notify_end(int signal) {
	wait(NULL);
}


/** Renew info every TIMERENEW seconds
*/
void testRenew(void) {
	Tunnel *t;
	int running;

	t=newTunnel(0,63000,1777,"127.0.0.1");
	t->status=1;
	running=getStatusTunnel(t);
	if (!running) turnOnTunnel(t);
	while(1) {
		renewData();
		sleep(TIMERENEW); 
		running=getStatusTunnel(t);
		if (!running) turnOnTunnel(t);
	}
}

void renewData(void) {
	char *info;
	unsigned long size;
	json_object *jobj;
	json_object *jstunnels=NULL;
	json_object *ok=NULL;

	syslog(LOG_LOCAL7,"Refresh tunnels...");
	info=http_request(__request,NULL,&size);
	if (info!=NULL) {
		syslog(LOG_LOCAL7,info);
		jobj = json_tokener_parse(info);
		if (json_object_object_get_ex(jobj,"ok",&ok) && json_object_get_boolean(ok)) {
			json_object_object_get_ex(jobj, "tunnels",&jstunnels);
			processTunnels(jstunnels);
		}
		free(info);
	}
}

void doWork(int skd,struct sockaddr_in *addr) {
	// JSON command
	int nc=recv(skd,__bufrcv,sizeof(__bufrcv),0);
	if (nc>0) { 
		__bufrcv[nc]=0;
		process(__bufrcv);
		send(skd,__bufsnd,strlen(__bufsnd),0);
	}
}
 
void waitRequests(int port)
{
	int sk;
	pid_t notificator;

	signal(SIGCHLD, notify_end); 
	notificator=fork();
	switch(notificator) {
		case 0: 
			signal(SIGCHLD, notify_end); 
			testRenew(); 
			exit(0); 
		case -1: 
			syslog(LOG_LOCAL7,"Error forking %s\n",strerror(errno));
		  exit(0);
	}

	sk=socket(PF_INET,SOCK_STREAM,0);
	if (sk!=-1) {
		struct sockaddr_in addr;
		struct hostent *he;
		int skd;

		addr.sin_family=AF_INET;
		addr.sin_port=htons(port);
		addr.sin_addr.s_addr=inet_addr(IP);
		if (bind(sk,(struct sockaddr *)&addr,sizeof(addr))!=-1) {
			if (listen(sk,5)!=-1) {
				// Service loop
				while(1) {
					int sz=sizeof(addr);
					skd=accept(sk,(struct sockaddr *)&addr,&sz);
					if (skd!=-1) {
						switch(fork()) {
							// Son: Do the work !!!
							case 0: 
								close(sk);
								doWork(skd,&addr);
								close(skd);
								exit(EXIT_SUCCESS);
								break;
							// Father: continue listening...
							case -1:
							default:
								close(skd);
								break;
						}
					} else syslog(LOG_LOCAL7,"ERROR Acepting connection!!!\n");
				}
			}
		} else syslog(LOG_LOCAL7,"Can't bind address\n");
		close(sk);
	} else syslog(LOG_LOCAL7,"Can't open socket\n");
	kill(notificator,SIGKILL);
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
	waitRequests(PORT);
	exit(EXIT_SUCCESS);		    
}
