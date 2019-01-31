#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "dstring.h"

/** dstring
		Creates a dstring string
*/
DString *dstring(const char *str) {
	int sz=DSTRING_CHUNK;
	int len=0;

	DString *dstr=malloc(sizeof(DString));
	if (dstr!=NULL) {
		if (str!=NULL) {
			len=strlen(str);
			while(sz<=len) sz+=DSTRING_CHUNK;
		}
		dstr->size=sz;
		dstr->length=len;
		dstr->string=malloc(sz);
		if (dstr->string == NULL) {
			free(dstr); dstr=NULL;
		} else {
			if (len > 0) strcpy(dstr->string,str);
			else         dstr->string[0]=0;
		}
	} else {
		dstr->size=sz;
		dstr->length=0;
		dstr->string=malloc(DSTRING_CHUNK);
		if (dstr!=NULL) dstr->string[0]=0;
		else {
			free(dstr); dstr=NULL;
		}
	}
	return dstr;
}

/** dstrcat
		Joins an string at dstring end
*/
DString *dstrcat(DString *dstr,const char *str) {
	int len=strlen(str);
	int sz=dstr->size;
	int tot;
	char *newstr;

	tot=dstr->length+len;
	while (sz <= tot ) sz+=DSTRING_CHUNK;
	if (sz >= dstr->size) {
		newstr=realloc(dstr->string,sz);
		if (newstr==NULL) {
			free(dstr->string);
			free(dstr);
			return NULL;
		}
		dstr->string=newstr;
	}
	memcpy(&(dstr->string[dstr->length]), str, len+1);
	//strcat(dstr->string,str);
	dstr->size=sz;
	dstr->length=tot;
	return dstr;
}

/** dstrjoin
		joins two dstrings
		NOT Free any dstring
*/
DString *dstrjoin(DString *dstr,DString *dstr1) {
	return dstrcat(dstr,dstr1->string);
}

/** dstrcpy
		Copies string into dstring
*/
DString *dstrcpy(DString *dstr,const char *str) {
	int len;

	len=strlen(str);
	if (len > DSTR_SIZE(dstr)) {
		dsfree(dstr);
		return dstring(str);
	} else {
		//strcpy(DSTR_STRING(dstr),str);
		memcpy(dstr->string,str,len+1);
		DSTR_LENGTH(dstr)=len;
	}
	return dstr;
}

/** dstrget
		Returns string into dstring and destroys dstring
		STRING returned is dynamic. Needs to be freed
*/
char *dstrget(DString *dstr) {
	char *str;

	str=realloc(dstr->string,dstr->length+1);
	free(dstr);
	return str;
}

/** dstrfree
		Free a dstring
*/
void dsfree(DString *dstr) {
	free(dstr->string);
	free(dstr);
}

