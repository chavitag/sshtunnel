#ifndef __TUNNELH__
#define __TUNNELH__

//#define GW "gateway@shuttle.iesrodeira.com"
//#define GW_PORT 27

#define GW "xavi@ssh.xavitag.es"
#define GW_PORT 22

#define TUNNEL_ID(t)				((t).id->intNumber)
#define TUNNEL_SOURCEPORT(t)	((t).sourceport->intNumber)
#define TUNNEL_DESTPORT(t)		((t).destport->intNumber)
#define TUNNEL_MONITOR(t)		((t).monitor->intNumber)
#define TUNNEL_IP(t)				((t).ip->string)
#define TUNNEL_STARTED(t)		((t).started->boolean)

typedef struct tagTunnel {
	VALUEJSON *id;
	VALUEJSON *sourceport;
	VALUEJSON *destport;
	VALUEJSON *ip;
	VALUEJSON *started;
	VALUEJSON *monitor;
} Tunnel; 

extern Tunnel *parseTunnel(JSONDATA *jstunnel,Tunnel *t);
int getMonitorPort(void);
extern int turnOnTunnel(Tunnel *t);
void onTunnel(int monitor,int sourceport,char *ip,int destport);
extern int turnOffTunnel(Tunnel *t);
void offTunnel(int monitor,int sourceport,char *ip,int destport);
extern int getStatusTunnel(Tunnel *t);
int verifyTunnel(int source,char *ip,long int *monitor,int dest);
extern DString *JSON_TunnelList(JSONDATA *jstunnels);

#endif
