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

#define MAXTRIES 9 


char *_GW;
int _GW_PORT;

static char *getOpenPorts(char *output,int len); 
static int portIsOpen(int port);
static int waitForTunnel(int port);

/** parseTunnel
		Parses a Json Tunnel. Tunnel fields are pointers to JSON List nodes information fields 
*/
Tunnel *parseTunnel(JSONDATA *jstunnel,Tunnel *t) {
	if (jstunnel->type!=JSON_OBJECT) return NULL;
	memset(t,0,sizeof(Tunnel));

#ifdef _DEBUG
DString *str=dstringJson(jstunnel,TRUE);

printf("Parsing tunnel...%s\n",str->string); fflush(stdout);

dsfree(str);
#endif

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
#ifdef _DEBUG
printf("Parsed tunnel..."); fflush(stdout);
#endif

	if ((t->id==NULL)||(t->sourceport==NULL)||(t->destport==NULL)||(t->ip==NULL)||(t->started==NULL)||(t->monitor==NULL)) return NULL;

#ifdef _DEBUG
printf("IP %s\n",TUNNEL_IP(*t)); fflush(stdout);
#endif

	return t;
}

/** turnOnTunnel
			switchs on a tunnel
*/
int turnOnTunnel(Tunnel *t) {
	TUNNEL_MONITOR(*t)=getMonitorPort();
	if (TUNNEL_MONITOR(*t)<0) return -1;
	onTunnel(TUNNEL_MONITOR(*t),TUNNEL_SOURCEPORT(*t),TUNNEL_IP(*t),TUNNEL_DESTPORT(*t));
	TUNNEL_STARTED(*t)=getStatusTunnel(t);
}

/** onTunnel
			Creates a tunnel in monitor port  sourceport:ip:destport
*/
void onTunnel(int monitor,int sourceport,char *ip,int destport) {
	char buffer[1024];
	time_t now;
	char echoport[8];

	if (_GW==NULL) {
		syslog(LOG_INFO,"Unknown Gateway");;
		return;
	}

	if (monitor<0) {
		syslog(LOG_INFO,"Error: Monitor port is < 0");
		return;
	}

	if (ECHOPORT!=0) snprintf(echoport,8,":%d",ECHOPORT);
	else 	echoport[0]=0;
	time(&now);
	if (monitor > 0) {
		snprintf(buffer,1024,"/usr/lib/autossh/autossh -f -M %d%s -N -R %d:%s:%d -o \"ServerAliveInterval 15\" -o \"ServerAliveCountMax 3\" -o \"ConnectTimeout 10\" -o \"ExitOnForwardFailure yes\" %s	-p%d", monitor, echoport, sourceport, ip, 
					destport, _GW, _GW_PORT);
	} else {
		snprintf(buffer,1024,"/usr/lib/autossh/autossh -f -M 0 -N -R %d:%s:%d -o \"ServerAliveInterval 15\" -o \"ServerAliveCountMax 3\" -o \"ConnectTimeout 10\" -o \"ExitOnForwardFailure yes\" %s	-p%d", sourceport, ip, 
					destport, _GW, _GW_PORT);
	}
	syslog(LOG_INFO,"%s -> ON TUNNEL: %s\n",ctime(&now),buffer);
	run(buffer);
	if (!waitForTunnel(monitor)) {
		syslog(LOG_INFO,"Tunnel is not opened yet!!!!!");
		offTunnel(monitor,sourceport,ip,destport);
	}
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
	char echoport[8];

	if (ECHOPORT!=0) snprintf(echoport,8," %d",ECHOPORT);
	else 	echoport[0]=0;
	
	time(&now);
	/*snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep \"[M] %d%s -N -R %d:%s:%d\"|tr -s ' '|cut -d' ' -f 4`; if ! [ -z \"$xx\" ]; then pkill -P $xx; fi",
				monitor,echoport,sourceport,ip,destport);*/
	snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep \"[-]R %d:%s:%d\"|tr -s ' '|cut -d' ' -f 4`; if ! [ -z \"$xx\" ]; then pkill -P $xx; kill -9 $xx; fi",
				sourceport,ip,destport);
	syslog(LOG_INFO,"%s -> OFF TUNNEL: %s\n",ctime(&now),buffer);
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

#ifdef _DEBUG
printf("Testing tunnel %d:%s:%d\n",source,ip,dest);
#endif

	/* if (source==0) {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{5\\} \\?[0-9]\\? -N -R [0-9]\\{5\\}:%s:'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",ip);
	} else {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{5\\} \\?[0-9]\\? -N -R %d:%s:%d'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",source,ip,dest);
	} */
	if (source==0) {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{1,5\\} \\?[0-9]\\? -N -R [0-9]\\{5\\}:%s:'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",ip);
	} else {
		snprintf(buffer,1024,"xx=`ps -elf|grep autossh|grep  -e '[M] [0-9]\\{1,5\\} \\?[0-9]\\? -N -R %d:%s:%d'|tr -s ' '|cut -d' ' -f17`; if [ -z \"$xx\" ]; then exit 0; else echo $xx; exit 1; fi",source,ip,dest);
	}

	runStr(buffer,result,1023); // Run shell command and gets an string result
	if (strlen(result)>0) {
		*monitor=atoi(result);

#ifdef _DEBUG
printf("Tunnel running. Monitor port %d\n",*monitor);
#endif
		snprintf(buffer,1024,"xx=`ps -elf|grep 'ssh [-]L %d:127.0.0.1:7 -N -R'`;if [ -z \"$xx\" ]; then exit 0; else echo $xx|tr -s ' ' '*'|cut -d* -f 5; exit 1; fi",*monitor);
		runStr(buffer,result,1023);
		if (strlen(result) > 0) return 1;
		else {
			syslog(LOG_INFO,"Monitor conexion died. Killing tunnel %d:%s:%d",source,ip,dest);
			offTunnel(*monitor,source,ip,dest);
			*monitor=-1;
		}
	} else *monitor=-1;
	return 0;
}

/** getMonitorPort
		gets a free monitor port for a new tunnel
*/
int getMonitorPort(void) {
#ifdef MONITOR0
	return 0;
#else
	int port=63999;
	char buffer[1024];
	int status;
	char teststr[7];

	getOpenPorts(buffer,1024);

	snprintf(teststr,7,"%d,",port);

	while(strstr(buffer,teststr)!=NULL) {
		if (ECHOPORT==0) port-=2;
		else		 port--;
		snprintf(teststr,7,"%d,",port);
	}
	if (port<=6299) {
		syslog(LOG_INFO,"*** Too Much Tunnels !!!\n");
		return -1;
	}
	return port;
#endif
}

/** JSON_TunnelList
		Returns JSON DString with tunnel info status
*/
DString *JSON_TunnelList(JSONDATA *jstunnels) {
	return dstringJson(jstunnels,TRUE);
}

// ---------------------------------------------------
//				Private Methods
// ---------------------------------------------------

/** getOpenPorts
 * 	Returns open monitor ports list
 */
static char *getOpenPorts(char *output,int len) {
	char buffer[256];

	snprintf(buffer,256,"netstat -a -p -n |grep 127.0.0.1|grep LISTEN|grep ssh|tr -s ' ' '*'|cut -d* -f 4|cut -d: -f 2|tr '\r\n' ,");
	runStr(buffer,output,len);
	return output;
}


/** portIsOpen
		Returns true if port is open
*/
static int portIsOpen(int port){
	char buffer[256];
	char test[256];

	snprintf(buffer,256,"netstat -a -p -n |grep 127.0.0.1|grep LISTEN|grep ssh|grep %d|tr -s ' ' '*'|cut -d* -f 4|cut -d: -f 2",port);
	runStr(buffer,test,sizeof(test));
	if (strlen(test)==0) return 0;
	return 1;	

//	snprintf(buffer,256,"xx=`nmap localhost -p %d|grep open`; if [ -z \"$xx\" ]; then exit 0; else exit 1; fi",port);
//	buffer[255]=0;
//	return run(buffer); 
}

/** waitForTunnel
*/
static int waitForTunnel(int port) {
	struct timespec ts;
	int tries=1;

	ts.tv_sec=0;
	//ts.tv_nsec=99999999;
	ts.tv_nsec=100000000;
	nanosleep(&ts,NULL);
	while(!portIsOpen(port) && (++tries <= MAXTRIES)) {
		//sleep(1);
		ts.tv_nsec=0;
		ts.tv_nsec=100000000*tries;
		syslog(LOG_INFO,"Not open yet %d... retrying !!",ts.tv_nsec);
		nanosleep(&ts,NULL);
	}
syslog(LOG_INFO,"Done in %d tries (%d MAX)",tries,MAXTRIES);
	return (tries <= MAXTRIES);
}

