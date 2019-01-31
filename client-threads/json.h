#ifndef __JSONH
#define __JSONH

#include "dstring.h"

#define JSON_NULL		0
#define JSON_BOOLEAN	1
#define JSON_INTEGER	2
#define JSON_FLOAT	3
#define JSON_STRING 	5
#define JSON_OBJECT	6
#define JSON_ARRAY	7

#define MAX_JSON_FIELD 128
#define TRUE 1
#define FALSE 0

#define _isdigit(d) (((d>='0')&&(d<='9'))||(d=='.'))
#define _mayboolean(s) ((s=='t')||(s=='T')||(s=='f')||(s=='F'))
#define _maynull(s) ((s=='N')||(s=='n'))

#define JSON_NEXT(obj)			(obj->next);
#define JSON_PREV(obj)			(obj->prev);
#define JSON_FATHER(obj)		(obj->father);
#define JSON_INFO(obj)			(obj->json_info)
#define JSON_GET_OBJECT(obj) 	(obj->json_info.jobject)
#define JSON_GET_ARRAY(obj) 	(obj->json_info.jobject)
#define JSON_GET_STRING(obj)	(obj->json_info.string)
#define JSON_GET_FLOAT(obj)	(obj->json_info.floatNumber)
#define JSON_GET_INT(obj)		(obj->json_info.intNumber)
#define JSON_GET_BOOLEAN(obj)	(obj->json_info.boolean)
#define GET_OBJECT(val) 	(val.jobject)
#define GET_ARRAY(val) 		(val.jobject)
#define GET_STRING(val)		(val.string)
#define GET_FLOAT(val)		(val.floatNumber)
#define GET_INT(val)			(val.intNumber)
#define GET_BOOLEAN(val)	(val.boolean)

typedef union tagVALUEJSON {
	unsigned char boolean;
	double	floatNumber;
	long		intNumber;
	char		*string;
	struct tagJSONDATA *jobject;
} VALUEJSON;

typedef struct tagJSONDATA {
	int type;
	char json_field[MAX_JSON_FIELD];
	VALUEJSON json_info;
	struct tagJSONDATA *next;
	struct tagJSONDATA *prev;
	struct tagJSONDATA *father;
} JSONDATA;

#ifdef WITHPTHREADS
	extern pthread_mutex_t 	__mutexJSON;
#endif

// Auxiliar string functions 
// TODO: New source code stringutils.c / stringutils.h
extern char *rtrim(char *str);
extern char *ltrim(char *str);
extern char *trim(const char *str,char *dest);
extern char *strtoupper(char *str,char *boolstr,int sz);

extern JSONDATA *parseJson(const char *jsonstr);
extern JSONDATA *linkNodeJson(JSONDATA *root,JSONDATA *node);
extern JSONDATA *lastNode(JSONDATA *root);
extern JSONDATA *cutNodeJson(JSONDATA *node);
extern JSONDATA *newNodeJson(JSONDATA *root,int type,char *field,VALUEJSON info);
extern JSONDATA *getNodeJson(JSONDATA *root,const char *field);
JSONDATA *getIdxNodeJson(JSONDATA *json,int idx);
extern VALUEJSON setValueJson(JSONDATA *,VALUEJSON info);
DString *dstringJson(JSONDATA *,int);
extern void freeJson(JSONDATA *json_object);

#endif
