/* json.c

	Simple json parsing code
*/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <float.h>

#ifdef WITHPTHREADS
	#include <pthread.h>
#endif

#include "dstring.h"
#include "json.h"

#ifdef WITHPTHREADS
	pthread_mutex_t __mutexJSON = PTHREAD_MUTEX_INITIALIZER;
#endif

static int parseNumber(char *start,JSONDATA *json_object,char **newpos);
static int parseBoolean(char *start,JSONDATA *json_object,char **newpos);
static int parseString(char *start,JSONDATA *json_object,char **newpos);
static int parseObject(char *start,JSONDATA *json_object,char **newpos);
static JSONDATA *parseValue(char *start,JSONDATA *json_object,char **newpos);
static JSONDATA *parseObjectJson(char *jsonstr,JSONDATA *json_object);
static JSONDATA *parseArrayJson(char *jsonstr,JSONDATA *json_object);

// -------------------------------------------->  INTERFACE

/** parseJson
		Parses JSON data. 
*/
JSONDATA *parseJson(const char *jsonstr) {
	JSONDATA *json_object=NULL;
	char *buffer;
	char *first;
	int len=strlen(jsonstr);

	buffer=malloc(len+1);
	if (buffer==NULL) return NULL;

	first=trim(jsonstr,buffer);

	if (first[0]!=0) {
		int end=strlen(first)-1;
		int start=1;
		char firstchar=first[0];
		char endchar;
	
		if (firstchar=='{') endchar='}';
		else if (firstchar=='[') endchar=']';
		else endchar=0;

		while((first[start]<=32)&&(start<end)) start++;  //Skips null chars at beginning
		if (start<end) { 
			if (first[end]==endchar) {
				json_object=calloc(1,sizeof(JSONDATA));
				if (json_object!=NULL) {
					first[end]=0;
					while((first[end]<=32) && (end >=0)) end--;	// Skips null chars at end
					first[end+1]=0;
					if (end!=0) {
						if (end==start) {
						}
						switch(firstchar) {
							case '{': 
								if (parseObjectJson(&first[start],json_object)==NULL) end=0;
								break;
							case '[':
								if (parseArrayJson(&first[start],json_object)==NULL) end=0;
								break;
						}
					}
					if (end==0) {
						freeJson(json_object);
						json_object=NULL;
					}
				}
			}
		}
	}
	free(buffer);
	return json_object;
}

/** getNodeJson
		Finds JSON Node by field title
*/
JSONDATA *getNodeJson(JSONDATA *json,const char *name) {
	do {
		if (json->json_field[0]!=0) {
			if (strcmp(name,json->json_field)==0) {
				return json;
			}
		}
		json=json->next;
	} while(json!=NULL);
	return NULL;
}

/** getIdxNodeJson
		Returns a node in JSON Array by index
*/
JSONDATA *getIdxNodeJson(JSONDATA *json,int idx) {
	int pos;
	
	if ((json->type!=JSON_ARRAY)&&(json->json_field[0]!=0)) return NULL;
	if (json->type==JSON_ARRAY) json=JSON_GET_OBJECT(json);
	else {
		while(json->prev!=NULL) json=json->prev;
	}
	pos=0;
	while ((pos<idx)&&(json!=NULL)) {
		json=json->next;
		pos++;
	}
	if ((pos==idx)&&(json!=NULL)) {
		if (json->type<JSON_OBJECT) 	return json;
		else 									return JSON_GET_OBJECT(json);
	}
	return NULL;
}

/** linkNodeJson
			Links a JSON node at JSON tree after pos
*/
JSONDATA *linkNodeJson(JSONDATA *pos,JSONDATA *node) {
	if ((pos!=NULL)&&(node!=NULL)) { 
		node->next=pos->next;
		pos->next=node;
		if (node->next!=NULL) node->next->prev=node;
		node->prev=pos;
	}
	return pos;
}

/** lastNode
			Gets last node
*/
JSONDATA *lastNode(JSONDATA *root) {
	JSONDATA *walk=root;

	while(walk->next!=NULL) walk=walk->next;
	return walk;
}

/** setValueJson
		Sets JSON node value. Returns old value
*/
VALUEJSON setValueJson(JSONDATA *node,VALUEJSON info) {
	VALUEJSON oldinfo;

	oldinfo=node->json_info;
	node->json_info=info;
	return oldinfo;
}

/** Make a new Json node
*/
JSONDATA *newNodeJson(JSONDATA *root,int type,char *field,VALUEJSON info) {
	JSONDATA *node;
	node=calloc(1,sizeof(JSONDATA));
	if (node==NULL) return NULL;
	node->type=type;
	memcpy(node->json_field,field,MAX_JSON_FIELD);
	node->json_info=info;
	return node;
}

/** "cut" a branch of json nodes tree
*/
JSONDATA *cutNodeJson(JSONDATA *node) {
	JSONDATA *father=node->father;
	if (father!=NULL) { // It's a first object node (Object,Array): CUT

		if (father->prev!=NULL) father->prev->next=father->next;
		if (father->next!=NULL) father->next->prev=father->prev;
		node->father=NULL;
		node->prev=NULL;
		free(father);
	} else {  // It's a data node (array, object, string, numeric, boolean...), unlink
		if (node->prev!=NULL) node->prev->next=node->next;
		if (node->next!=NULL) node->next->prev=node->prev;
		node->next=NULL;
		node->prev=NULL;
		node->father=NULL;
	}
	return node;
}

/** freeJson
		Free JSON object tree
*/
void freeJson(JSONDATA *json_object) {
	JSONDATA *ptr_next=NULL;
	JSONDATA *ptr_info=NULL;

	while (json_object!=NULL) {
		ptr_next=json_object->next;
		if ((json_object->type > JSON_FLOAT)&&(JSON_GET_OBJECT(json_object)!=NULL)) {
			if (json_object->type == JSON_STRING)	{
				if (JSON_GET_STRING(json_object)!=NULL) {
					free(JSON_GET_STRING(json_object));
				}
			} else 	{
				freeJson(JSON_GET_OBJECT(json_object));
			}
		} 
		free(json_object);
		json_object=ptr_next;
	}
}

/** dstringJson
		Converts JSON parsed data in a JSON string
		Returns a DString (dynamic string)
*/
DString *dstringJson(JSONDATA *json,int brackets) {
	DString *str=NULL;
	DString *join=NULL;
	int sz=0;
	char *limiters[2]={"{","}"};

	if (json==NULL) {
		if (brackets) return dstring("{}");
		else 			  return dstring("");
	} 

	while(json!=NULL) {
		if (str==NULL) {
			if (!brackets) {
				if ((str=dstring(NULL))==NULL) return NULL;
			} else {
				if (json->json_field[0]==0) {
					limiters[0]="["; limiters[1]="]";
				}
				if ((str=dstring(limiters[0]))==NULL) return NULL;
			}
		} else { 
			if (dstrcat(str,",")==NULL) return NULL;
		}

		// Title
		if (json->json_field[0]!=0) {
			if (dstrcat(str,"\"")==NULL) return NULL;
			if (dstrcat(str,json->json_field)==NULL) return NULL;
			if (dstrcat(str,"\":")==NULL) return NULL;
		}
		// Content
		if (json->type==JSON_BOOLEAN) { 
			if (JSON_GET_BOOLEAN(json)) {
				if (dstrcat(str,"true")==NULL) return NULL;
			}	else if (dstrcat(str,"false")==NULL) return NULL;
		} else if (json->type==JSON_FLOAT) { 
			char buffer[32];
			snprintf(buffer,31,"%f",JSON_GET_FLOAT(json));
			buffer[31]=0;
			if (dstrcat(str,buffer)==NULL) return NULL;
		} else if (json->type==JSON_INTEGER) {
			char buffer[32];
			snprintf(buffer,31,"%d",JSON_GET_INT(json));
			buffer[31]=0;
			if (dstrcat(str,buffer)==NULL) return NULL;
		} else if (json->type==JSON_STRING) {
			if (dstrcat(str,"\"")==NULL) return NULL;
			if (dstrcat(str,JSON_GET_STRING(json))==NULL) return NULL;
			if (dstrcat(str,"\"")==NULL) return NULL;
		} else if ((json->type==JSON_OBJECT) || (json->type==JSON_ARRAY) ){
			if (json->type==JSON_OBJECT) {
				if (dstrcat(str,"{")==NULL) return NULL;
			} else {
				if (dstrcat(str,"[")==NULL) return NULL;
			}
			if (JSON_GET_OBJECT(json)!=NULL)	{
				join=dstringJson(JSON_GET_OBJECT(json),FALSE);
				if (join==NULL) {
					dsfree(str);
					return NULL;
				}
				if (dstrjoin(str,join)==NULL) {
					dsfree(join);
					return NULL;
				}
				dsfree(join);
			}
			if (json->type==JSON_OBJECT) {
				if (dstrcat(str,"}")==NULL) return NULL;
			} else {
				if (dstrcat(str,"]")==NULL) return NULL;
			}
		}
		json=json->next;
	}
	if ((brackets)&&((dstrcat(str,limiters[1]))==NULL)) return NULL;
	return str;
}



/** ltrim
		Delete left "no-chars"
			->string 
*/
char *ltrim(char *str) {
	while((*str<=32)&&(*str!=0)) str++;
	return str;
}

/** rtrim
		Delete right "no-chars"
			string<-
*/
char *rtrim(char *str) {
	int end=strlen(str)-1;

	while(str[end]<=32) end--;
	if (str[end]==',') end--;		// No trailing ,
	if (end<0) return NULL;
	str[end+1]=0;
	return str;
}

/** trim
		Delete right and left "no-chars"
			->string<-
*/
char *trim(const char *str,char *dest) {
	strcpy(dest,str);
	if (rtrim(dest)!=NULL) {
		return ltrim(dest);
	} else dest[0]=0;
	return dest;
}

/** strtoupper
		Converts not null-terminated word to uppercase
*/
char *strtoupper(char *str,char *boolstr,int sz) {
	int idx;

	sz--;
	for(idx=0;(idx<sz) && (*str!=0);idx++,str++) {
		boolstr[idx]=toupper(*str);
		if ((boolstr[idx]<'A')||(boolstr[idx]>'Z')) break;
	}
	boolstr[idx]=0;
	return boolstr;
}

//------------------------------------------------    PRIVATE FUNCTIONS

/** parseNumber
			Inserts Numeric Value in json_object
*/
static int parseNumber(char *start,JSONDATA *json_object,char **newpos) {
	char *end;
	char endchar;
	char isfloat=0;

	if (_isdigit(*start)) {	
		end=start+1;
		while(_isdigit(*end)) {
			if (*end=='.') {
				if (isfloat) return -1;
				isfloat=1;
			}
			end++;
		}
		endchar=*end;
		*end=0;
		if (isfloat) {
			json_object->type=JSON_FLOAT;
			json_object->json_info.floatNumber=atof(start);
		} else {
			json_object->type=JSON_INTEGER;
			json_object->json_info.intNumber=atol(start);
		}
		*end=endchar;
		*newpos=end;
		return 1;
	} 
	return 0;
}

/** parseBoolean
		Inserts Boolean value in json_object
*/
static int parseBoolean(char *start,JSONDATA *json_object,char **newpos) {
	char boolstr[6];
	char *end;
	char endchar;

	if (_mayboolean(*start)) {
		json_object->type=JSON_BOOLEAN;
		end=start;
		while((*end >= 'F')&&(*end <= 'z')) end++;
		endchar=*end;
		*end=0;
		strtoupper(start,boolstr,6);
		*end=endchar;
		if (strcmp("TRUE",boolstr)==0) {
			json_object->json_info.boolean=TRUE;
		} else if (strcmp("FALSE",boolstr)==0) {
			json_object->json_info.boolean=FALSE;
		} else {
			return -1;
		}
		*newpos=end;
		return 1;
	}
	return 0;
}

/** parseNull
		Inserts Null value in json_object
*/
static int parseNull(char *start,JSONDATA *json_object,char **newpos) {
	char nullstr[5];
	char *end;
	char endchar;

	if (_maynull(*start)) {
		json_object->type=JSON_INTEGER;
		end=start;
		while((*end >= 'F')&&(*end <= 'z')) end++;
		endchar=*end;
		*end=0;
		strtoupper(start,nullstr,5);
		*end=endchar;
		if (strcmp("NULL",nullstr)==0) {
			json_object->json_info.intNumber=0;
		} else {
			return -1;
		}
		*newpos=end;
		return 1;
	}
	return 0;
}

/** parseString
		Insers String value in json_object
*/
static int parseString(char *start,JSONDATA *json_object,char **newpos) {
	char *str;
	char *end;
	int sz;

	if (*start=='"') {
		start++;
		end=start;
		while((*end > 0) && (*end != '\"')) {
			end++;
			if ((*end=='\"')&&(*(end-1)=='\\')) {
				sz=strlen(end)+1;
				memmove(end-1,end,sz);
			}
		}
		if (*end!='\"') {
			return -1;
		}
		json_object->type=JSON_STRING;
		*end=0;		// Overwrites end double quote
		str=malloc(strlen(start)+1);
		if (str==NULL) {
			return -1;
		}
		strcpy(str,start);
		json_object->json_info.string=str;
		*newpos=(end+1);
		return 1;
	}
	return 0;
}

/** parseObject
		Inserts Array / JSON Object value in json_object
*/
static int parseObject(char *start,JSONDATA *json_object,char **newpos) {
	JSONDATA *jd;
	char *end;
	char endchar;

	if ((*start!='{') && (*start!='[')) {
		return -1;
	} else if (*start=='{') { // Object
		int cta=1;
		int str=0;

		end=start+1;
		while(*end > 0) {
			if ((*end=='\"')&&(*(end-1)!='\\')) str=1-str;
			else if (!str) {
				if (*end=='}') cta--;
				else if (*end=='{') cta++;
				if (cta==0) break;
			}
			end++;
		}
		if (*end!='}') {
				return -1;
		}
		json_object->type=JSON_OBJECT;
	} else if (*start=='[') { // Array
		int cta=1;
		int str=0;

		end=start+1;
		while(*end > 0) {
			if ((*end=='\"')&&(*(end-1)!='\\')) str=1-str;
			else if (!str) {
				if (*end==']') cta--;
				else if (*end=='[') cta++;
				if (cta==0) break;
			}
			end++;
		}
		if (*end!=']') {
			return -1;
		}
		json_object->type=JSON_ARRAY;
	}
	if (*end!=0) end++;
	endchar=*end;
	*end=0;
	json_object->json_info.jobject=parseJson(start);
	if (json_object->json_info.jobject!=NULL) json_object->json_info.jobject->father=json_object;
	*end=endchar;
	*newpos=end;
	return 1;
}

/** parseValue
		Parses JSON value ({ "field": JSON body,... })
*/
static JSONDATA *parseValue(char *start,JSONDATA *json_object,char **newpos) {
	int code;

	code=parseNull(start,json_object,&start);
	if (code==0) {
		code=parseNumber(start,json_object,&start);
		if (code==0) {
			code=parseBoolean(start,json_object,&start);
			if (code==0) {
				code=parseString(start,json_object,&start);
				if (code==0) code=parseObject(start,json_object,&start);
			}
		}
	}
	if (code<0) return NULL;

	// Next Field
	while ((*start!=0)&&(*start!=',')) start++;
	if (*start!=0) {
		start++;
		while((*start<=32)&&(*start!=0)) start++;
	}
	*newpos=start;
	return json_object;
}

/** parseObjectJson
		Analize jsonstr JSON Object and insterts new node in json_object
*/
static JSONDATA *parseObjectJson(char *jsonstr,JSONDATA *json_object) {
	JSONDATA *ret=json_object;

	if (json_object!=NULL) {
		char *end;
		char *start;
		char endchar;

		start=jsonstr;
		do {
			// Field Title
			//
			if (*start!='\"') {
				return NULL;
			}
			end=strchr((start+1),'"');
			if (end==NULL) {
				return NULL;
			}
			*end=0;
			strncpy(json_object->json_field,&start[1],MAX_JSON_FIELD);
			start=end+1;
			if (*start!=':') {
				return NULL;
			}

			// Field Value
			//
			start++;
			while(*start<=32) start++;
			json_object=parseValue(start,json_object,&start);
			if (json_object==NULL) return NULL;

			// Next Node
			//
			if (*start!=0)	{
				json_object->next=calloc(1,sizeof(JSONDATA));
				if (json_object->next==NULL) return NULL;
				json_object->next->prev=json_object;
				json_object=json_object->next;
				
			}
		} while(*start!=0);
	}
	return ret;
}

/** parseArrayJson
		Analize jsonstr JSON Array and insterts new node in json_object
*/
static JSONDATA *parseArrayJson(char *jsonstr,JSONDATA *json_object) {
	JSONDATA *ret=json_object;

	if (json_object!=NULL) {
		char *end;
		char *start;

		start=jsonstr;
		do {
			json_object->json_field[0]=0; // Arrays has no field titles
			if (parseValue(start,json_object,&start)==NULL) return NULL;

			// Next array value
			if (*start!=0) {
				while((*start<=32)&&(*start!=0)) start++;
			}

			// New Node
			if (*start!=0)	{
				json_object->next=calloc(1,sizeof(JSONDATA));
				if (json_object->next==NULL) return NULL;
				json_object->next->prev=json_object;
				json_object=json_object->next;
			}
		} while(*start!=0);
	}
	return ret;
}
