#ifndef __DSTRINGH
#define __DSTRINGH

#define DSTR_STRING(dstr) (dstr->string)
#define DSTR_LENGTH(dstr) (dstr->length)
#define DSTR_SIZE(dstr) (dstr->size)

#define DSTRING_CHUNK 128

typedef struct tagDString {
	unsigned int size;
	unsigned int length;
	char *string;
} DString;

#define dstr(s) (s->string)

extern DString *dstring(const char *str);
extern DString *dstrcat(DString *dstr,const char *str);
extern DString *dstrjoin(DString *dstr,DString *dstr1);
extern DString *dstrcpy(DString *dstr,const char *str);
extern char *dstrget(DString *dstr);
extern void dsfree(DString *str);

#endif
