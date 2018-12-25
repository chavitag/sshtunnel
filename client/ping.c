#include <stdio.h>
#include <signal.h>
#include <strings.h>
#include <string.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <sys/time.h>
#include <sys/socket.h>
#include <unistd.h>
#include <netinet/in.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <netdb.h>
#include <setjmp.h>
#include <errno.h>

#define PACKET_SIZE     4096
#define MAX_WAIT_TIME   3
#define MAX_NO_PACKETS  3

char sendpacket[PACKET_SIZE];
char recvpacket[PACKET_SIZE];

int sockfd, datalen = 56;
int nsend = 0, nreceived = 0;
struct sockaddr_in dest_addr;
pid_t pid;
struct sockaddr_in from;
struct timeval tvrecv;

unsigned short cal_chksum(unsigned short *addr, int len);
int pack(int pack_no);
int send_packet(void);
int recv_packet(void);
int unpack(char *buf, int len);
//void tv_sub(struct timeval *out, struct timeval *in);
int isAlive(char *ip);

unsigned short cal_chksum(unsigned short *addr, int len) {
    int nleft = len;
    int sum = 0;
    unsigned short *w = addr;
    unsigned short answer = 0;

    while (nleft > 1)  {
        sum +=  *w++;
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

int pack(int pack_no) {
    int i, packsize;
    struct icmp *icmp;
    struct timeval *tval;

    icmp = (struct icmp*)sendpacket;
    icmp->icmp_type = ICMP_ECHO;
    icmp->icmp_code = 0;
    icmp->icmp_cksum = 0;
    icmp->icmp_seq = pack_no;
    icmp->icmp_id = pid;
    packsize = 8+datalen;
    tval = (struct timeval*)icmp->icmp_data;
    gettimeofday(tval, NULL); 
    icmp->icmp_cksum = cal_chksum((unsigned short*)icmp, packsize); 
    return packsize;
}


int send_packet(void) { 
    int packetsize;
    nsend=0;
    while (nsend < MAX_NO_PACKETS)   {
        nsend++;
        packetsize = pack(nsend); 
        if (sendto(sockfd, sendpacket, packetsize, MSG_DONTWAIT, (struct sockaddr*)&dest_addr, sizeof(dest_addr)) < 0) {
        	 return -1;
        } 
		  usleep(10000); 
    }
	 return nsend;
}

int recv_packet(void) {
    int n, fromlen,tries;
    extern int errno;

	 nreceived=0; tries=0;
    fromlen = sizeof(from);
    while (nreceived < nsend) {
		  if (tries > 50) return 0;
        if ((n = recvfrom(sockfd, recvpacket, sizeof(recvpacket), MSG_DONTWAIT, (struct sockaddr*) &from, &fromlen)) < 0) {
				usleep(10000);
				tries++;
            if (errno == EINTR)  continue;
            continue;
        } 
		  gettimeofday(&tvrecv, NULL); 
        if (unpack(recvpacket, n) ==  - 1) {
			tries++;
			continue;
		  }
        nreceived++;
    }
	 return nreceived;
}

int unpack(char *buf, int len) {
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
    else                                                               return  -1;
}


/*void tv_sub(struct timeval *out, struct timeval *in) {
    if ((out->tv_usec -= in->tv_usec) < 0) {
        --out->tv_sec;
        out->tv_usec += 1000000;
    } out->tv_sec -= in->tv_sec;
} */

int isAlive(char *ip) {
	 int ret;
    struct hostent *host;
    struct protoent *protocol;
    unsigned long inaddr = 0l;
    int waittime = MAX_WAIT_TIME;
    int size = 50 * 1024;

    if ((protocol = getprotobyname("icmp")) == NULL) return -1;
    if ((sockfd = socket(AF_INET, SOCK_RAW, protocol->p_proto)) < 0) return -1;

    setuid(getuid());
    setsockopt(sockfd, SOL_SOCKET, SO_RCVBUF, &size, sizeof(size));
    bzero(&dest_addr, sizeof(dest_addr));
    dest_addr.sin_family = AF_INET;
    if (inaddr = inet_addr(ip) == INADDR_NONE) {
        if ((host = gethostbyname(ip)) == NULL) return -1;
        memcpy((char*) &dest_addr.sin_addr, host->h_addr, host->h_length);
    } else
        dest_addr.sin_addr.s_addr = inet_addr(ip);
	
	 pid = getpid();
    if (send_packet() < 0) return -1;
    ret=recv_packet(); 
    close(sockfd);
	 return ret;
}

void main(int argc,char *argv[]) {
	if (isAlive(argv[1])>0)	printf("%s Is On\n",argv[1]);
	else							printf("%s Is Off\n",argv[1]);
}

