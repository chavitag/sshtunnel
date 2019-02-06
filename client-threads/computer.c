#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <time.h>
#include <syslog.h>

#include "runcmd.h"
#include "sshcmd.h"
#include "ping.h"
#include "json.h"
#include "dstring.h"
#include "computer.h"

static JSONDATA *__computers=NULL;		// Computer's circular list to keep computer's status


void freeComputers(void) {
	if (__computers!=NULL) freeJson(__computers);
	__computers=NULL;
}

JSONDATA *computerWalk(JSONDATA *last) {
	if (last==NULL) return __computers;
	else return __computers->next;
}

/** Search computer in queue by id
*/
JSONDATA *getComputer(unsigned int id,Computer *c) {
	JSONDATA *walk=__computers;
	if (walk==NULL) return NULL;
	do {
		parseComputer(walk,c);
		if (COMPUTER_ID(*c)==id) break;
		walk=walk->next;
	} while(walk!=NULL);
	if (COMPUTER_ID(*c)==id) return walk;
	return NULL;
}

/** unregisterComputer
		Unlink and free a registered node computer
*/
void unregisterComputer(JSONDATA *computer) {
	if ((computer==__computers) && (__computers->next==NULL)) __computers=NULL;
	else	{
		if (__computers->prev==computer) __computers->prev=computer->prev;
		cutNodeJson(computer);
	}
	freeJson(computer);
}

/** Gets computer running status and register in computer's list
	status: 0 - Off, 1 - Starting, 2 - Running
*/
Computer *registerComputer(JSONDATA *computer,Computer *c) {
	time_t t;
	Computer rc;
	JSONDATA *old;
	JSONDATA *temp;

#ifdef _DEBUG
printf("Registering new Computer %s\n",COMPUTER_IP(*c)); fflush(stdout);
#endif

	if ((old=getComputer(COMPUTER_ID(*c),&rc))!=NULL) {	 // Exists, update information and delete old node
		if (old==computer) return c;

#ifdef _DEBUG
printf("%s Exists, updating data\n",COMPUTER_IP(*c)); fflush(stdout);
#endif

		COMPUTER_STATUS(*c)=COMPUTER_STATUS(rc);
		COMPUTER_STARTTIME(*c)=COMPUTER_STARTTIME(rc);
		COMPUTER_LASTSCAN(*c)=COMPUTER_LASTSCAN(rc);

		if (old->prev==NULL) { // Only one computer in list
#ifdef _DEBUG
printf("Only One node. Setting list nodes to NULL\n"); fflush(stdout);
#endif
			freeJson(old);
			__computers=NULL;
		} else {
#ifdef _DEBUG
printf("Unlinking\n"); fflush(stdout);
#endif

			if (__computers->prev==old) 	temp=old->prev;	// Delete last: new last
			else 									temp=__computers->prev;			// Delete not last: old last
			if (temp==__computers) temp=NULL;	// Only remains one node
			if (old==__computers) {  // Delete first
				__computers->prev=NULL;
				__computers=__computers->next;
			}
#ifdef _DEBUG
printf("Cut old node\n"); fflush(stdout);
#endif
			cutNodeJson(old);

#ifdef _DEBUG
printf("Node Unlinked!!!\n"); fflush(stdout);
#endif
			if (temp!=NULL) temp->next=NULL;
			__computers->prev=temp;

#ifdef _DEBUG
printf("Free old node\n"); fflush(stdout);
#endif
			freeJson(old);
		}
	} else {
		 COMPUTER_LASTSCAN(*c)=0;
	}

	// Link New Node
#ifdef _DEBUG
printf("Linking new node\n"); fflush(stdout);
#endif

	if (__computers==NULL) {
		__computers=computer;
		__computers->next=NULL;
		__computers->prev=NULL;
	} else {
		if (__computers->prev==NULL) linkNodeJson(__computers,computer);
		else 									linkNodeJson(__computers->prev,computer);
		__computers->prev=computer;

	}

#ifdef _DEBUG
printf("Computer %s registered!!!\n",COMPUTER_IP(*c)); fflush(stdout);
#endif

	return c;
}

/** getStatusComputer
		Check if a computer is running
*/
int getStatusComputer(Computer *c) {
	time_t t;
	int alive;

#ifdef _DEBUG
printf("Comprobando estado o equipo ");
printf(COMPUTER_IP(*c));
printf("\n"); fflush(stdout);
#endif

	// Check Computer status...
	t=time(NULL);
	if (((t-COMPUTER_LASTSCAN(*c)) > TIME_SCAN_WAIT)) {  // Needs update
		COMPUTER_LASTSCAN(*c)=t;
		alive=isAlive(COMPUTER_IP(*c));
		if (alive<0) return -1;
		if (alive) {
			COMPUTER_STATUS(*c)=RUNNING;
			COMPUTER_STARTTIME(*c)=0;
		} else {
			if (COMPUTER_STARTTIME(*c)!=0) {
				if ((t-COMPUTER_STARTTIME(*c)) > TIME_START_WAIT) {
					COMPUTER_STATUS(*c)=STOPPED;
					COMPUTER_STARTTIME(*c)=0;
				} else COMPUTER_STATUS(*c)=STARTING;
			} else COMPUTER_STATUS(*c)=STOPPED;
		}
	}
	return COMPUTER_STATUS(*c);
}

/** parseComputer
		Gets computer info from JSONDATA into a Computer struct
*/
Computer *parseComputer(JSONDATA *s_computer,Computer *c) {
	JSONDATA *computer;

	if (s_computer->type!=JSON_OBJECT) return NULL;	// node must be a JSON_OBJECT node (computer's information)
	computer=JSON_GET_OBJECT(s_computer);				// Recover computer's init node
	if (computer!=NULL) {									// Yes, it's exists
		if (c==NULL) {
			c=calloc(1,sizeof(Computer));					// I need a destination place for computer's info
			if (c==NULL) return NULL;
		} else {
			memset(c,0,sizeof(Computer));
		}
		// Gets computer's info
		do {
			if (strcmp(computer->json_field,"id")==0) c->id=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"domainname")==0) c->domainname=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"ip")==0) c->ip=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"description")==0) c->description=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"mac")==0)  c->mac=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"status")==0)  c->status=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"startTime")==0) c->startTime=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"lastscan")==0) c->lastscan=&JSON_INFO(computer);
			else if (strcmp(computer->json_field,"scan")==0) c->scan=&JSON_INFO(computer);

			computer=computer->next;
		} while(computer!=NULL);
		if ((c->id==NULL)||(c->ip==NULL)) return NULL;
	}
	return c; 
}

/** Switch Computer Off
		Windows:
			net rpc -S IP -U Administrator%passadministrator shutdown -t 1 -f
		Linux:
			uses sshcmd library to execute shutdown -h now
*/
int turnOffComputer(char *ip,const char *credentials) {
	char buffer[256];
	int iswindows;
	time_t now;


	if (credentials!=NULL) { 
		time(&now);
		syslog(LOG_LOCAL7,"%s -> TRY OFF COMPUTER: %s\n",ctime(&now),ip);
		// If port 22 is open, must be a Linux computer. 
		snprintf(buffer,256,"xx=`nmap %s -p 22|grep tcp|grep open`; if [ -z \"$xx\" ]; then exit 0; else exit 1; fi",ip);
		iswindows=run(buffer);
		if (!iswindows) sshCommand(ip,"shutdown -h now","root",credentials,buffer,256);
		else {
			snprintf(buffer,256,"/usr/bin/net rpc -S %d -U %s shutdown -t 1 -f",ip,credentials);
			run(buffer);
		}
	}
}

/** Switchs Computer On
*/
int switchOn(char *mac) {
	char buffer[256];
	time_t now;

	time(&now);
	snprintf(buffer,256,"/usr/bin/wakeonlan %s",mac);
	syslog(LOG_LOCAL7,"%s -> ON COMPUTER: %s\n",ctime(&now),buffer);
	run(buffer);
	return 0;
}

/** JSON_ComputerList
		Returns Computer's Array in JSON Format
*/
DString *JSON_ComputerList(void) {
	return dstringJson(__computers,TRUE);
}
