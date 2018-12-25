#include <stdio.h>
#include <string.h>
#include "base64.h"

int main(int argc,char *argv[]) {
	char buffer[16384];
	unBase64(buffer,sizeof(buffer),argv[1],strlen(argv[1])+1);
	printf("%s\n",buffer);
}
