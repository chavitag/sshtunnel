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

#include <sys/stat.h>
#include <fcntl.h>
#include <json.h>
#include <json_object.h>

#include "http.h"

#define true 1
#define false 0

#define IP "127.0.0.1"
#define PORT 1777 
#define TIMERENEW	600
#define REQUEST  "http://sshtunnel.xavitag.es/service?apikey=api-key-tunnel"
#define RESPONSE "http://sshtunnel.xavitag.es/service?do=update&apikey=api-key-tunnel"

extern int isAlive(const char *ip);
extern int switchOn(char *ifname,const char *mac);

void doWork(int skd,struct sockaddr_in *addr);
void notify_end(int signal);
void waitRequests(int port);
void testRenew(void);
void renewData(void);
char *process(char *data);

/*typedef struct tagComputer {
	unsigned int id;
	char domainname[];
	char ip[];
	char description[];
	char mac[];
	byte status;
} Computer;

/*typedef struct tagTunnel {
	unsigned int id;
	unsigned short sourceport;
	unsigned short destport;
	char ip[];
	byte started;
} Tunnel;*/

int veces=0;
char bufrcv[1000000];
char bufsnd[1000000];


/** Protocol Definition

	Requests:
		{ "tunnels": [{"id": ,"from": ,"to": , "dport": , "status":}], "computers": [{"id":,"ip":,"mac":,"action":}] }

	Responses:
		{ "tunnels": [{"id":, "sport": }], "computers": [{"id":,"status":}]}

*/
void doWork(int skd,struct sockaddr_in *addr) {
	// JSON command
	int nc=recv(skd,bufrcv,sizeof(bufrcv),0);
	if (nc>0) { 
		bufrcv[nc]=0;
		process(bufrcv);
		send(skd,bufsnd,strlen(bufsnd),0);
	}
	close(skd);
}

int turnOnComputer(const char *ip,const char *mac,int status) {
	/* if (status) {
		if (!isAlive(ip)) {
			switchOn("eth0",mac);
			sleep(1); 
		}
	}
	return isAlive(ip); */
	return true;
}

int setTunnel(const char *ip, const char *dest, int field) {
	return 9997;
}

char *process(char *data) {
	json_object * jobj;
	json_object *ok=NULL;
	json_object *jsaction=NULL;
	json_object *jstunnels=NULL;
	json_object *jscomputers=NULL;
	json_object *el;
	json_object *field;
	json_object *dest;
	json_object *ip;
	json_object *command=NULL;
	json_object *id=NULL;
	json_object *status=NULL;
	int srcport=-1;
	size_t len;
	int idx;

	jobj = json_tokener_parse(data);
	if (json_object_object_get_ex(jobj,"ok",&ok) && json_object_get_boolean(ok)) {
		json_object_object_get_ex(jobj, "action",&jsaction);
		json_object_object_get_ex(jobj, "tunnels",&jstunnels);
		json_object_object_get_ex(jobj, "computers",&jscomputers);

		// jsaction
		if (jsaction!=NULL) {
			printf("\t ** Recibido Comando %s\n",json_object_to_json_string(jsaction));
			json_object_object_get_ex(jsaction,"command",&command);
			json_object_object_get_ex(jsaction,"id",&id);
			json_object_object_get_ex(jsaction,"status",&status);
			printf("Recibido comando %s\n",json_object_get_string(command));
		}



		// Turn On Computers...
		len=json_object_array_length(jscomputers);

		for (idx=0;idx<len;idx++) {
			el=json_object_array_get_idx(jscomputers,idx);
			printf("\t ** Procesando %s\n",json_object_to_json_string(el));
			json_object_object_get_ex(el,"status",&field);
			json_object_object_get_ex(el,"mac",&dest);
			json_object_object_get_ex(el,"ip",&ip);
			if (!turnOnComputer(json_object_get_string(ip),json_object_get_string(dest),json_object_get_boolean(field))) {
				//json_object_set_boolean(field,true);
				json_object_object_del(el,"status");
				json_object_object_add(el,"status",json_object_new_boolean(false));
			} else {
				json_object_object_del(el,"status");
				json_object_object_add(el,"status",json_object_new_boolean(true));
			}
		}

		// Configure Tunnels
		len=json_object_array_length(jstunnels);
		printf(" %d tunnels\n",len);
		for(idx=0;idx<len;idx++) {
			el=json_object_array_get_idx(jstunnels,idx);
			printf("\t ** Procesando %s\n",json_object_to_json_string(el));
			json_object_object_get_ex(el,"started",&field);
			json_object_object_get_ex(el,"destport",&dest);
			json_object_object_get_ex(el,"ip",&ip);

			srcport=setTunnel(json_object_get_string(ip),json_object_get_string(dest),json_object_get_boolean(field));
			if (srcport <= 0) {
				//json_object_set_boolean(field,true);
				json_object_object_del(el,"started");
				json_object_object_add(el,"started",json_object_new_boolean(false));
			} else {
				json_object_object_del(el,"started");
				json_object_object_add(el,"started",json_object_new_boolean(true));
				json_object_object_del(el,"sourceport");
				json_object_object_add(el,"sourceport",json_object_new_int(srcport));
			}
		}
		snprintf(bufsnd,sizeof(bufsnd),"{\"ok\":true,\"tunnels\":%s,\"computers\": %s}",json_object_to_json_string(jstunnels), json_object_to_json_string(jscomputers));
		//printf("***** %s ******\n",bufsnd);
	}
	return bufsnd;
}

void notify_end(int signal) {
	wait(NULL);
}
 
void waitRequests(int port)
{
	int sk;
	pid_t notificator;

	signal(SIGCHLD, notify_end); 
	notificator=fork();
	switch(notificator) {
		case 0: 
			testRenew(); 
			signal(SIGCHLD, notify_end); 
			exit(0); 
		case -1: 
			printf("Error forking %s\n",strerror(errno));
		  exit(0);
	}

	sk=socket(PF_INET,SOCK_STREAM,0);
	if (sk!=-1) {
		struct sockaddr_in addr;
		struct hostent *he;
		time_t now;
		int skd;
		int fl;

		addr.sin_family=AF_INET;
		addr.sin_port=htons(port);
		addr.sin_addr.s_addr=inet_addr(IP);
		if (bind(sk,(struct sockaddr *)&addr,sizeof(addr))!=-1) {
			if (listen(sk,5)!=-1) {
				while(1) {
					int sz=sizeof(addr);
					skd=accept(sk,(struct sockaddr *)&addr,&sz);
					if (skd!=-1) {
						switch(fork()) {
							// Son: Do the work !!!
							case 0: 
								close(sk);
								// One by one, please... register time of access...
								fl=open("/tmp/lck.lck",O_WRONLY|O_CREAT,S_IWRITE|S_IREAD);
								if (fl!=-1) {
									flock(fl,LOCK_EX);
									now=time(NULL);
									write(fl,&now,sizeof(time_t));
									doWork(skd,&addr);
									flock(fl,LOCK_UN);
									close(fl);
								} 
								exit(EXIT_SUCCESS);
								break;
							// Father: continue listening...
							case -1:
							default:
								close(skd);
								break;
						}
					} else printf("ERROR !!!\n");
				}
			}
		} else printf("Can't bind address\n");
		close(sk);
	} else printf("Can't open socket\n");
	kill(notificator,SIGKILL);
}

/** Renew info every TIMERENEW seconds
*/
void testRenew(void) {
	time_t now=time(NULL);
	time_t last=0;
	int fl;

	while(1) {
		now=time(NULL);
		fl=open("/tmp/lck.lck",O_RDONLY);
		if (fl!=-1) {
			read(fl,&last,sizeof(time_t));
			close(fl);
		} 
		if ((now - last) > TIMERENEW) renewData();
		sleep(TIMERENEW); 
	}
}

void renewData(void) {
	char *info;
	unsigned long size;

	printf("Refresh Info....\n");
	veces++;
	info=http_request(REQUEST,NULL,&size);
	/*if (info!=NULL) {
		printf("---->%s\n",info);*/
//TODO:
		snprintf(bufsnd,sizeof(bufsnd),"%s",process(info));
		//http_request(RESPONSE,process(info),&size); // Update database to current state....
	free(info);
}

/** MAIN: Background process
*/
void main(int argc,char *argv[]) {

	pid_t pid, sid;
	if ((pid=fork())==-1)  {
         exit(EXIT_FAILURE); 	 
  }
  if (pid!=0) exit(EXIT_SUCCESS);
  umask(0);
  sid = setsid();
  if (sid < 0) {
	printf("Error setsid %s\n",strerror(errno));
  	exit(EXIT_FAILURE);
  }
  
  close(STDIN_FILENO);
//close(STDOUT_FILENO);
//close(STDERR_FILENO);
  waitRequests(PORT);	
  exit(EXIT_SUCCESS);		    
}
