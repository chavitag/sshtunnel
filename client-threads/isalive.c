#include <stdio.h>
#include <signal.h>
#include <strings.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/socket.h>
#include <unistd.h>
#include <time.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <netdb.h>
#include <setjmp.h>
#include <errno.h>

#include "ping.h"

static unsigned short cal_chksum(unsigned short *addr, int len);
static int pack(pid_t pid,int pack_no,char *buffer_packet);
static int send_packet(int sockfd,pid_t pid,struct sockaddr_in *dest_addr);
static int recv_packet(int sockfd,pid_t pid,int nsend,struct sockaddr_in *from);
static int unpack(pid_t pid,char *buf, int len);

/** isAlive
		Determine if a ip host is alive by icmp packets (ping)
*/
int isAlive(char *ip) {
	int ret=-1;
	struct hostent *host;
	struct protoent *protocol;
	unsigned long inaddr = 0l;
	//int waittime = MAX_WAIT_TIME;
	int size = 50 * 1024;
	pid_t pid;
	int nsend;
	int sockfd;
	struct sockaddr_in dest_addr;
	struct sockaddr_in from;

#ifdef _DEBUG
	printf("Comprobando equipo %s ",ip); fflush(stdout);
#endif

	if ((protocol = getprotobyname("icmp")) == NULL) return -1;
	if ((sockfd = socket(AF_INET, SOCK_RAW, protocol->p_proto)) < 0) return -1;

	//setuid(getuid());
	setsockopt(sockfd, SOL_SOCKET, SO_RCVBUF, &size, sizeof(size));
	bzero(&dest_addr, sizeof(dest_addr));
	dest_addr.sin_family = AF_INET;
	if (inaddr = inet_addr(ip) == INADDR_NONE) {
		if ((host = gethostbyname(ip)) == NULL) return -1;
		memcpy((char*) &dest_addr.sin_addr, host->h_addr, host->h_length);
	} else {
		dest_addr.sin_addr.s_addr = inet_addr(ip);
	}
	pid = getpid();

	nsend=send_packet(sockfd,pid,&dest_addr);
	if (nsend < 0) return -1;
	ret=recv_packet(sockfd,pid,nsend,&from); 
	close(sockfd);

#ifdef _DEBUG
	printf("Resultado %d\n ",ret); fflush(stdout);
#endif

	return ret;
}


//----------------------------------------
//----------> private functions
//----------------------------------------

/** cal_chksum
*/
static unsigned short cal_chksum(unsigned short *addr, int len) {
	int nleft = len;
	int sum = 0;
	unsigned short *w = addr;
	unsigned short answer = 0;

	while (nleft > 1)  {
		sum+=*w++;
		nleft -= 2;
	}
	if (nleft == 1)  {
		*(unsigned char*)(&answer) = *(unsigned char*)w;
		sum += answer;
	}
	sum = (sum >> 16) + (sum &0xffff);
	sum += (sum >> 16);
	answer = ~sum;
	return answer;
}

/** pack
*/
static int pack(pid_t pid,int pack_no,char *sendpacket) {
	int i, packsize;
	struct icmp *icmp;
	struct timeval *tval;

	icmp = (struct icmp*)sendpacket;
	icmp->icmp_type = ICMP_ECHO;
	icmp->icmp_code = 0;
	icmp->icmp_cksum = 0;
	icmp->icmp_seq = pack_no;
	icmp->icmp_id = pid;
	packsize = 8+DATALEN;
	tval = (struct timeval*)icmp->icmp_data;
	gettimeofday(tval, NULL); 
	icmp->icmp_cksum = cal_chksum((unsigned short*)icmp, packsize); 
	return packsize;
}

/** send_packet
*/
static int send_packet(int sockfd, pid_t pid,struct sockaddr_in *dest_addr) { 
	char sendpacket[PACKET_SIZE];
	int packetsize;
	int nsend;
	struct timespec wait_time;

	wait_time.tv_sec=0;
	wait_time.tv_nsec=5000000;

	nsend=0;
	while (nsend < MAX_NO_PACKETS)   {
		nsend++;
		packetsize = pack(pid,nsend,sendpacket); 
		if (sendto(sockfd, sendpacket, packetsize, MSG_DONTWAIT, (struct sockaddr*)dest_addr, sizeof(struct sockaddr_in)) < 0) {
			return -1;
		} 
		nanosleep(&wait_time,NULL); 
	}
	return nsend;
}

/** recv_packet
*/
static int recv_packet(int sockfd,pid_t pid,int nsend,struct sockaddr_in *from) {
	int n, fromlen,tries;
	char recvpacket[PACKET_SIZE];
	int nreceived;
	struct timeval tvrecv;
	struct timespec wait_time;

	wait_time.tv_sec=0;
	wait_time.tv_nsec=5000000;
	nreceived=0; tries=0;
	fromlen = sizeof(struct sockaddr_in);
	while (nreceived < nsend) {
		if (tries > 50) return 0;
		if ((n = recvfrom(sockfd, recvpacket, sizeof(recvpacket), MSG_DONTWAIT, (struct sockaddr*) from, &fromlen)) < 0) {
			nanosleep(&wait_time,NULL);
			tries++;
			//if (errno == EINTR)  continue;
			continue;
		} 
		if (unpack(pid,recvpacket, n) ==  - 1) {
			tries++;
			continue;
		}
		gettimeofday(&tvrecv, NULL); 
		nreceived++;
	}
	return nreceived;
}

/** unpack
*/
static int unpack(pid_t pid,char *buf, int len) {
	int i, iphdrlen;
	struct ip *ip;
	struct icmp *icmp;
	struct timeval *tvsend;
	double rtt;

	ip = (struct ip*)buf;
	iphdrlen = ip->ip_hl << 2; 
	icmp = (struct icmp*)(buf + iphdrlen);
	len -= iphdrlen; 
	if (len < 8) return  -1;
	if ((icmp->icmp_type == ICMP_ECHOREPLY) && (icmp->icmp_id == pid)) return 1;
	return  -1;
}


void main(int argc,char *argv[]) {
	if (isAlive(argv[1])>0)	printf("%s Is On\n",argv[1]);
	else							printf("%s Is Off\n",argv[1]);
}

