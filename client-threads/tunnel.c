#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <syslog.h>

#include "runcmd.h"
#include "json.h"
#include "dstring.h"
#include "tunnel.h"

/** parseTunnel
		Parses a Json Tunnel. Tunnel fields are pointers to JSON List nodes information fields 
*/
Tunnel *parseTunnel(JSONDATA *jstunnel,Tunnel *t) {
	if (jstunnel->type!=JSON_OBJECT) return NULL;
	memset(t,0,sizeof(Tunnel));

	jstunnel=JSON_GET_OBJECT(jstunnel);

	while(jstunnel!=NULL) {
		if (strcmp(jstunnel->json_field,"id")==0) t->id=&JSON_INFO(jstunnel);
		else if (strcmp(jstunnel->json_field,"sourceport")==0) t->sourceport=&JSON_INFO(jstunnel);
		else if (strcmp(jstunnel->json_field,"destport")==0) t->destport=&JSON_INFO(jstunnel);
		else if (strcmp(jstunnel->json_field,"ip")==0) t->ip=&JSON_INFO(jstunnel);
		else if (strcmp(jstunnel->json_field,"started")==0) t->started=&JSON_INFO(jstunnel);
		else if (strcmp(jstunnel->json_field,"monitor")==0) t->monitor=&JSON_INFO(jstunnel);
		jstunnel=jstunnel->next;
	}
	if ((t->id==NULL)||(t->sourceport==NULL)||(t->destport==NULL)||(t->ip==NULL)||(t->started==NULL)||(t->monitor==NULL)) return NULL;
	return t;
}

/** turnOnTunnel
			switchs on a tunnel
*/
int turnOnTunnel(Tunnel *t) {
	TUNNEL_MONITOR(*t)=getMonitorPort();
	if (TUNNEL_MONITOR(*t)==0) return -1;
	onTunnel(TUNNEL_MONITOR(*t),TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),TUNNEL_DESTPORT(*t));
	TUNNEL_STARTED(*t)=getStatusTunnel(t);
}

/** onTunnel
			Creates a tunnel in monitor port  sourceport:ip:destport
*/
void onTunnel(int monitor,int sourceport,char *ip,int destport) {
	char buffer[1024];
	time_t now;

	time(&now);
	snprintf(buffer,1024,"/usr/lib/autossh/autossh -f -M %d -N -R %d:%s:%d	%s	-p%d", monitor, sourceport, ip, 
				destport, GW, GW_PORT);
	syslog(LOG_LOCAL7,"%s -> ON TUNNEL: %s\n",ctime(&now),buffer);
	run(buffer);
}

/** turnOffTunnel
		switchs off a tunnel
*/
int turnOffTunnel(Tunnel *t) {
	offTunnel(TUNNEL_MONITOR(*t),TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),TUNNEL_DESTPORT(*t));
	TUNNEL_STARTED(*t)=getStatusTunnel(t);
}

/** offTunnel
		Destroys a running tunnel in monitor port sourceport:ip:destport
*/
void offTunnel(int monitor,int sourceport,char *ip,int destport) {
	char buffer[1024];
	time_t now;
	
	time(&now);
	snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep \"[M] %d -N -R %d:%s:%d\"|tr -s ' '|cut -d' ' -f 4`; if ! [ -z \"$xx\" ]; then pkill -P $xx; fi",
				monitor,sourceport,ip,destport);
	syslog(LOG_LOCAL7,"%s -> OFF TUNNEL: %s\n",ctime(&now),buffer);
	run(buffer);  // run shell command
}

/** getStatusTunnel
		Returns tunnel status: 1 running, 0 stopped
*/
int getStatusTunnel(Tunnel *t) {
	if (verifyTunnel(TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),&TUNNEL_MONITOR(*t),TUNNEL_DESTPORT(*t))) {
		TUNNEL_STARTED(*t)=1;
		return 1;
	} else TUNNEL_STARTED(*t)=0;
	return 0;
}

/** verifyStatusTunnel
		verify if a tunnel is running at source:ip:dest and gets its monitor port
*/
int verifyTunnel(int source,char *ip,long int *monitor,int dest) {
	char buffer[1024];
	char result[1024];
	int status;

	if (source==0) {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{5\\} -N -R [0-9]\\{5\\}:%s:'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",ip);
	} else {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{5\\} -N -R %d:%s:%d'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",source,ip,dest);
	}
	runStr(buffer,result,1023); // Run shell command and gets an string result
	if (strlen(result)>0) {
		*monitor=atoi(result);
		return 1;
	} else *monitor=0;
	return 0;
}

/** getMonitorPort
		gets a free monitor port for a new tunnel
*/
int getMonitorPort(void) {
	int port=64000;
	char buffer[256];
	int status;

	do {	// Scan free monitor port
		port-=2;
		snprintf(buffer,256,"xx=`nmap localhost -p %d|grep open`; if [ -z \"$xx\" ]; then exit 0; else exit 1; fi",port);
		buffer[255]=0;
		status=run(buffer); // run shell command
	} while((status)&&(port>62999));
	if (port<=62999) { // No free port
		syslog(LOG_LOCAL7,"*** Too Much Tunnels !!!\n");
		return 0;
	}
	return port;
}

/** JSON_TunnelList
		Returns JSON DString with tunnel info status
*/
DString *JSON_TunnelList(JSONDATA *jstunnels) {
	return dstringJson(jstunnels,TRUE);
}
