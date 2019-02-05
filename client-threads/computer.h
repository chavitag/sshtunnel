#ifndef __COMPUTERH__
#define __COMPUTERH__

#include "json.h"

#define MAX_COMPUTERS 1000
#define TIME_START_WAIT (5*60)
#define TIME_SCAN_WAIT	(15)

#define STOPPED 	0
#define STARTING 	1
#define RUNNING	2
#define SHUTTINGDOWN 3

#define COMPUTER_ID(cinfo) 			((cinfo).id->intNumber)
#define COMPUTER_DOMAIN(cinfo)		((cinfo).domainname->string)
#define COMPUTER_IP(cinfo)				((cinfo).ip->string)
#define COMPUTER_DESCRIPTION(cinfo)	((cinfo).description->string)
#define COMPUTER_MAC(cinfo)			((cinfo).mac->string)
#define COMPUTER_STATUS(cinfo)		((cinfo).status->intNumber)
#define COMPUTER_STARTTIME(cinfo)	((cinfo).startTime->intNumber)
#define COMPUTER_LASTSCAN(cinfo)		((cinfo).lastscan->intNumber)
#define COMPUTER_SCAN(cinfo)			((cinfo).scan->boolean)

typedef struct tagComputer {
	VALUEJSON *id;
	VALUEJSON *domainname;
	VALUEJSON *ip;
	VALUEJSON *description;
	VALUEJSON *mac;
	VALUEJSON *status;	// STOPPED,STARTING,RUNNING
	VALUEJSON *startTime;
	VALUEJSON *lastscan;
	VALUEJSON *scan;	// 0 not check status, 1 check status
} Computer;

extern void freeComputers(void);
extern JSONDATA *computerWalk(JSONDATA *last);
extern JSONDATA *getComputer(unsigned int id,Computer *c);
extern Computer *registerComputer(JSONDATA *computer,Computer *c);
extern int getStatusComputer(Computer *c);
extern Computer *parseComputer(JSONDATA *s_computer,Computer *c);
int switchOn(char *mac);
extern int turnOffComputer(char *ip,const char *credentials);
extern DString *JSON_ComputerList(void);

#endif
