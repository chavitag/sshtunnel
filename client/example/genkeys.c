#include <time.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <mcrypt.h>
#include "mycrypt.h"

char _iv[16];
char _key[32];
char _info[64];

int main(int argc,char *argv[])
{
	char buffer[256];
	int idx;

	if (argc < 4) {
		printf("genkeys <key> <user> <keyhost> [users...]\n");
		exit(0);
	}
	if (strlen(argv[1])!=32) {
		printf("<key> must be 32 characters long\n");
		exit(0);
	}

	fillRandom(_iv,16);	 // iv aleatorio de 16 bits
	fillRandom(_info,64); //chave de cifrado aleatoria de 64 bits...
	memcpy(_key,argv[1],32);

   // Ciframos a chave aleatoria e o IV aleatorio	(chave aleatoria de cifrado, cifrada con argv[1]) SECRETFILE (secret.key)
	char *cifrado=encrypt(_info,64,_iv,_key,32);
	FILE *fp=fopen("secret.key","wb"); fwrite(cifrado,64,1,fp); fwrite(_iv,16,1,fp); fclose(fp);
	free(cifrado);

	// authority.db conten o usuario autorizado cifrado coa chave aleatoria (ad_proxy key) AUTHFILE (argv[2])
	memcpy(_key,_info,32);
	cifrado=encrypt(argv[2],strlen(argv[2])+1,_iv,_key,32);
   fp=fopen("authority.db","wb"); fwrite(cifrado,64,1,fp); fclose(fp);
	free(cifrado);

	// secomm.db conten a chave ssh de "comunicacion" cifrado coa chave aleatoria (ssh key)
	cifrado=encrypt(argv[3],strlen(argv[3])+1,_iv,_key,32);
	fp=fopen("secomm.db","wb"); fwrite(cifrado,64,1,fp); fclose(fp);
	free(cifrado);

	// users.db conten os usuarios cifrados coa chave aleatoria, parella usuario:password
	if (argc>4) {
		fp=fopen("users.db","wb");
		for (idx=4;idx<argc;idx++) {
			snprintf(buffer,sizeof(buffer),"%s",argv[idx]);
			cifrado=encrypt(buffer,strlen(buffer)+1,_iv,_key,32);
			fwrite(cifrado,64,1,fp);
			free(cifrado);
		}
		fclose(fp);
	}
	return 0;
}

