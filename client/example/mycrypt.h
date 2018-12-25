#ifndef __CRYPTH__
#define __CRYPTH__
char *encrypt( void *,int,char* ,char* ,int );
char *decrypt(  void* , int ,char* ,char* ,int );
char *init_s_cypher(char *);
char *close_s_cypher(void); 
char *s_cypher(char *text,int l,char *file,char *iv);
char *s_decypher (char *text,int l,char *file,char *iv);
void fillRandom(char *,int);
char *getSecureKey(char *,char *);
char *crypt_key(void);

extern int _blksz;
#endif
