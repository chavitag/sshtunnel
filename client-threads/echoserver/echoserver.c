#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <netdb.h>
#include <syslog.h>
#include <signal.h>
#include <pthread.h>
#include <fcntl.h>
#include <errno.h>

#include <sys/types.h>
#include <sys/wait.h>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define BUFSIZE 1024
 
void startServers(int port);
void notify_end(int signal);
int udpechoserver(int port);
int tcpechoserver(int port);
void *echoTCP(void *skd);

/** notify_end
		Notifies child end
*/
void notify_end(int signal) {
	wait(NULL);
}


void startServers(int port)
{
	pid_t notificator;

#ifdef _DEBUG
  printf("Starting UDP/TCP echo servers\n"); fflush(stdout);
#endif

	signal(SIGCHLD, notify_end); 
	notificator=fork();
	switch(notificator) {
		case 0:
			// Son: UDP Server
			// 
			signal(SIGCHLD, notify_end); 
			udpechoserver(port); 
			syslog(LOG_INFO,"UDP server is died!!!");
			exit(0); 
		case -1:
			syslog(LOG_INFO,"ERROR starting servers");
		  exit(0);
		default:
			tcpechoserver(port);
			kill(notificator,SIGKILL);
	}
}

int udpechoserver(int port) {
	int sockfd;		/* socket */
	int clientlen;		/* byte size of client's address */
	struct sockaddr_in serveraddr;	/* server's addr */
	struct sockaddr_in clientaddr;	/* client addr */
	struct hostent *hostp;	/* client host info */
	char *hostaddrp;	/* dotted decimal host addr string */
	int optval;		/* flag value for setsockopt */
	int n;			/* message byte size */
	char buff[BUFSIZE];
	char string[256];

	/* 
	 * socket: create the parent socket 
	 */
	sockfd = socket(AF_INET, SOCK_DGRAM, 0);
	if (sockfd < 0) {
		syslog(LOG_INFO,"ERROR creating UDP socket");
		return 1;
	}

	/* setsockopt: Handy debugging trick that lets 
	 * us rerun the server immediately after we kill it; 
	 * otherwise we have to wait about 20 secs. 
	 * Eliminates "ERROR on binding: Address already in use" error. 
	 */
	optval = 1;
	setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR,(const void *)&optval, sizeof(int));

	/*
	 * build the server's Internet address
	 */
	bzero((char *)&serveraddr, sizeof(serveraddr));
	serveraddr.sin_family = AF_INET;
	serveraddr.sin_addr.s_addr = htonl(INADDR_ANY);
	serveraddr.sin_port = htons((unsigned short)port);

	/* 
	 * bind: associate the parent socket with a port 
	 */
	if (bind(sockfd, (struct sockaddr *)&serveraddr,sizeof(serveraddr)) < 0) {
		syslog(LOG_INFO,"ERROR binding UDP address");
		return 1;
	}

#ifdef _DEBUG
	printf("UDP Server loop...\n"); fflush(stdout);
#endif

	/* 
	 * main loop: wait for a datagram, then echo it
	 */
	clientlen = sizeof(clientaddr);
	while (1) {
		/*
		 * recvfrom: receive a UDP datagram from a client
		 */
		n = recvfrom(sockfd, buff, BUFSIZE-1, 0,(struct sockaddr *)&clientaddr, &clientlen);
		if (n < 0) {
			syslog(LOG_INFO,"ERROR receiving UDP data");
			break;
		}
		buff[n]=0;

#ifdef _DEBUG
	printf("Recibido %s (%d bytes)\n",buff,n);  fflush(stdout);
#endif

		/* 
		 * gethostbyaddr: determine who sent the datagram
		 */
		hostp = gethostbyaddr((const char *)&clientaddr.sin_addr.s_addr, sizeof(clientaddr.sin_addr.s_addr), AF_INET);
		if (hostp == NULL) {
			syslog(LOG_INFO,"ERROR getting UDP client address");
			break;
		}
		hostaddrp = inet_ntoa(clientaddr.sin_addr);
		if (hostaddrp == NULL) {
			syslog(LOG_INFO,"ERROR can't convert address to a IP string format\n");
			break;
		}
		snprintf(string,255,"Echo UDP service for %s\n",hostaddrp);
		syslog(LOG_INFO,string);
		
		/* 
		 * sendto: echo the input back to the client 
		 */
		n = sendto(sockfd, buff, n, 0, (struct sockaddr *)&clientaddr, clientlen);
		if (n < 0) {
			syslog(LOG_INFO,"ERROR sending echo reply");
			break;
		}
	}
	return 1;
}


int tcpechoserver(int port) {
	int sk;
	pthread_t id_thread;
	char *hostaddrp;
	char string[256];

#ifdef _DEBUG
	printf("Open TCP Socket...\n"); fflush(stdout);
#endif

	sk=socket(PF_INET,SOCK_STREAM,0);
	if (sk!=-1) {
		struct sockaddr_in addr;
		struct hostent *he;
		long int skd;
		int sz;

#ifdef _DEBUG
	printf("OK\n"); fflush(stdout);
#endif

		addr.sin_family=AF_INET;
		addr.sin_port=htons(port);
		addr.sin_addr.s_addr=htonl(INADDR_ANY);

#ifdef _DEBUG
	printf("Binding TCP Address\n"); fflush(stdout);
#endif
		if (bind(sk,(struct sockaddr *)&addr,sizeof(addr))!=-1) {

#ifdef _DEBUG
	printf("Establishing listen queue...\n"); fflush(stdout);
#endif

			if (listen(sk,5)!=-1) {
				// Service loop

#ifdef _DEBUG
	printf("OK. Entering TCP Server loop...\n"); fflush(stdout);
#endif
				sz=sizeof(addr);
				while(1) {
#ifdef _DEBUG
 printf("Waiting for connection...\n");  fflush(stdout);
#endif
					skd=accept(sk,(struct sockaddr *)&addr,&sz);
					if (skd!=-1) {
						hostaddrp = inet_ntoa(addr.sin_addr);
						if (hostaddrp == NULL) {
							syslog(LOG_INFO,"ERROR can't convert address to a IP string format\n");
							break;
						}
						snprintf(string,255,"Echo TCP service for %s\n",hostaddrp);
						syslog(LOG_INFO,string);

						if (pthread_create(&id_thread,NULL,echoTCP,(void *)skd)) {
							syslog(LOG_INFO,"ERROR thread creation failed");
							syslog(LOG_INFO,strerror(errno));
							close(skd);
						}
					} else syslog(LOG_INFO,"ERROR Acepting connection!!!");
				}
			} else {
				syslog(LOG_INFO,"Listen Failed!!\n");
#ifdef _DEBUG
 printf("Error listen %s\n",strerror(errno));  fflush(stdout);
#endif
			}
		} else syslog(LOG_INFO,"Can't bind address\n");
		close(sk);
	} else syslog(LOG_INFO,"Can't open socket\n");
}

void *echoTCP(void *skd_addr) {
	char buf[BUFSIZE];
	long int skd=(long int)skd_addr;
	int flag = 1; 
	int nc;

	fcntl (skd, F_SETFD, FD_CLOEXEC);
	pthread_detach(pthread_self()); // No join...

	while(1) {

#ifdef _DEBUG
printf("Reading input....\n",buf); fflush(stdout);
#endif

		// reads JSON command from server
		nc=recv(skd,buf,sizeof(buf),0);
		if (nc>0) { 
			buf[nc]=0;

#ifdef _DEBUG
printf("Recibidos datos TCP petición: %s\n",buf); fflush(stdout);
#endif
			flag=send(skd,buf,nc,0);
			if (flag==-1) { // check error
				syslog(LOG_INFO,"Error enviando datos");
				syslog(LOG_INFO,strerror(errno));
				break;
			} 
		} else {
			syslog(LOG_INFO,"Closing TCP echo");
			break;
		}
	}
	close(skd);
	return NULL;
}

/** MAIN: Background process
*/
void main(int argc,char *argv[]) {
	pid_t pid, sid;
	int port;
	
	if (argc<2) {
		printf("echoserver PORT\n");
		exit(0);
	}
	port=atoi(argv[1]);

	if ((pid=fork())==-1)  {
		exit(EXIT_FAILURE); 	 
	}
	if (pid!=0) exit(EXIT_SUCCESS);

	openlog("echoserver", LOG_ODELAY, LOG_LOCAL7);

	sid = setsid();
	if (sid < 0) {
		syslog(LOG_INFO,"Error setsid %s\n",strerror(errno));
		exit(EXIT_FAILURE);
	}
#ifndef _DEBUG
	close(STDOUT_FILENO);
	close(STDERR_FILENO);
#endif
	startServers(port);
	closelog();
	exit(EXIT_SUCCESS);		    
}
