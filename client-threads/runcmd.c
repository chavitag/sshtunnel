#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>

/** run
		Executes a shell command and returns their execution status
*/
int run(char *command) {
	int pid;
	int status;
	/*char *cmd[2];

	cmd[0]=command;
	cmd[1]=NULL; */
	pid=fork();
	switch(pid) {
		case 0: // Forked process...
			execl("/bin/sh","sh","-c",command,NULL);
			exit(-1);
		default:
			waitpid(pid,&status,0);
			if (WIFEXITED(status)) return WEXITSTATUS(status);
			break;
	}
	return -1;
}

/** runStr
		executes a shell command and keeps the string result in buff
*/
int runStr(char *command,char *buff,int len) {
	buff[0]=0;
	FILE *f=popen(command,"r");
	if (f!=NULL) {
		fgets(buff,len,f);
		buff[len-1]=0;
		pclose(f);
		return 1;
	}
	return -1;
}

/*void main(int argc,char *argv[]) {
	char buffer[2048];
	printf("%d\n",runStr(argv[1],buffer,1024));
	printf("%s\n",buffer);
}*/
