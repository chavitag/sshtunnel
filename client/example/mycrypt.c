#include <time.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <mcrypt.h>
#include "mycrypt.h"

char _iv[16];
char _key[32];
char _info[32];
char *_ck="rivendel_cypher_key_secure081166";

char *_secBuff=NULL;
int _blksz=0;
char cryptBuffer[512];

char *crypt_key() {
	return _ck;
}

/* Devolve memoria reservada...
*/
char * encrypt(	void *buffer,
		int buffer_len, /* Because the plaintext could include null bytes*/
		char* IV,
		char* key,
		int key_len) {

	char *buffer_cifrado;
	int buffer_len_c=buffer_len;
	MCRYPT td = mcrypt_module_open("rijndael-256", NULL, "ecb", NULL);
	_blksz = mcrypt_enc_get_block_size(td);
	int resto=(buffer_len_c%_blksz);
	if (resto!=0) {
		buffer_len_c+=_blksz-resto;
	}
	buffer_cifrado=calloc(1, buffer_len_c);
	memcpy(buffer_cifrado,buffer,buffer_len); 
 
	mcrypt_generic_init(td, key, key_len, IV);
	int r=mcrypt_generic(td, buffer_cifrado, buffer_len_c); 
	mcrypt_generic_deinit (td);
	mcrypt_module_close(td);
	return buffer_cifrado;
}

/* Devolve memoria reservada...
*/
char *decrypt(	void* buffer,
		int buffer_len,
		char* IV,
		char* key,
		int key_len) {

	char *buffer_cifrado;  
	int buffer_len_c=buffer_len;
	MCRYPT td = mcrypt_module_open("rijndael-256", NULL, "ecb", NULL);
	_blksz = mcrypt_enc_get_block_size(td);

	int resto=(buffer_len_c%_blksz);
	if (resto!=0) {
		buffer_len_c+=_blksz-resto;
	}

	buffer_cifrado=calloc(1, buffer_len_c);
	memcpy(buffer_cifrado,buffer,buffer_len_c);       
	mcrypt_generic_init(td, key, key_len, IV);
	mdecrypt_generic(td, buffer_cifrado, buffer_len_c);
	mcrypt_generic_deinit (td);
	mcrypt_module_close(td); 
	return buffer_cifrado;
}


void fillRandom(char *buffer,int sz) {
	int i;
	srandom(time(NULL));
	for (i=0;i<sz;i++) buffer[i]=random()%256;
} 

/* Devolve memoria reservada
*/
char *file_get_contents(char *file) {
	char *info=NULL;
	FILE *fp;
	fp=fopen(file,"rb");
	
	if (fp!=NULL) {
		fseek(fp,0L,SEEK_END);
		int sz=ftell(fp);
		fseek(fp,0L,SEEK_SET);
		info=calloc(1,sz);
		if (info!=NULL) fread(info,sz,1,fp);
		fclose(fp);
	}
	return info;
}

char *init_s_cypher(char *file) {
	if (_secBuff==NULL) {
		_secBuff=file_get_contents(file);
	} 
	return _secBuff;
}

char *close_s_cypher() {
	if (_secBuff!=NULL) free(_secBuff);
	_secBuff=NULL;
}

char *s_cypher(char *text,int l,char *file,char *iv) {
	char *secret=NULL;
	char *info=NULL;

	if (l>256) return NULL;
	if (_secBuff==NULL) {
		info=file_get_contents(file);
		_secBuff=info;
	} else info=_secBuff;

	if (info!=NULL) {
		if (iv==NULL) memcpy(_iv,(info+64),16);
		else	      memcpy(_iv,iv,16);
		char *buffer=decrypt(info,64,_iv,_ck,32);
        	memcpy(_key,buffer,32);
		free(buffer);
		if (iv==NULL) iv=_iv;
		secret=encrypt(text,l,_iv,_key,32);
	}
	return secret;
}

char *s_decypher (char *text,int l,char *file,char *iv) {
	char *secret=NULL;
	char *info=NULL;

	if (l>256) return NULL; 
	if (_secBuff==NULL) {
		info=file_get_contents(file);
		_secBuff=info;
	} else info=_secBuff;
	if (info!=NULL) {
		if (iv==NULL) memcpy(_iv,(info+64),16);
		else	      memcpy(_iv,iv,16);
		char *buffer=decrypt(info,64,_iv,_ck,32);
        	memcpy(_key,buffer,32);
		free(buffer);
		if (iv==NULL) iv=_iv;
		secret=decrypt(text,l,_iv,_key,32);
	}
	return secret;
}

char *getSecureKey(char *file,char *buff) {
	char *user=file_get_contents(file);
	char *duser=s_decypher(user,64,"secret.key",NULL);
	memcpy(buff,duser,64);
	free(user);
	free(duser);
	return buff;
}

/* 
int main()
{
printf("%d\n",strlen("camion"));
char *cifrado=s_cypher("Camión",strlen("Camión"),"secret.key",NULL);
printf("Cifrado %s\n",cifrado);
char *decifrado=s_decypher(cifrado,17,"secret,key",NULL);
printf("Original %s\n",decifrado);
free(cifrado);
free(decifrado);

char *user=file_get_contents("authority.db");
char *duser=s_decypher(user,64,"secret.key",NULL);
printf("%s\n",duser);
free(user);
free(duser);

	return 0;
}
*/
