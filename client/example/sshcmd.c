#include <libssh/libssh.h>
#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <sys/stat.h> 

#include "sshcmd.h"

int verifyKnownHost(ssh_session session);


int verifyKnownHost(ssh_session session)
{
	int state;
	size_t hlen;
	ssh_key key;
	unsigned char *hash = NULL;
	char *hexa;
	char buf[10];

	state = ssh_is_server_known(session);
	//**** Not works in stable...
	//if (ssh_get_publickey(session,&key) == SSH_ERROR) return -1;
	//if (ssh_get_publickey_hash(key, SSH_PUBLICKEY_HASH_SHA1, &hash, &hlen) < 0) return -1;
	switch (state)
	{
		case SSH_SERVER_KNOWN_OK: 			
													break; /* ok */
		case SSH_SERVER_KNOWN_CHANGED: 								//free(hash); 
													return -1;
		case SSH_SERVER_FOUND_OTHER:								break;
		case SSH_SERVER_FILE_NOT_FOUND:	
		case SSH_SERVER_NOT_KNOWN:								break;
		case SSH_SERVER_ERROR:									//free(hash);
													return -1;
	}
	//free(hash);
	return 0;
}

void closeSSHSession(ssh_session session) {
	ssh_disconnect(session);
	ssh_free(session);
}

ssh_session openSSHSession(char *host,char *user,char *pass)
{
	ssh_session my_ssh_session;
	int rc;
	my_ssh_session = ssh_new();
	if (my_ssh_session != NULL) {
		ssh_options_set(my_ssh_session, SSH_OPTIONS_HOST, host);
		ssh_options_set(my_ssh_session, SSH_OPTIONS_USER, user);
		rc = ssh_connect(my_ssh_session);
		if (rc==SSH_OK) {
			if (verifyKnownHost(my_ssh_session)==0) { 
				rc = ssh_userauth_password(my_ssh_session, NULL, pass);
				if (rc == SSH_AUTH_SUCCESS) {
					return my_ssh_session;
				}
				else printf("ERRORSSH: Usuario e/ou contrasinal incorrectas\n");
			} else {
				fprintf(stdout, "ERRORSSH: Error verify %s: %s\n",host,
				ssh_get_error(my_ssh_session));
			}
			closeSSHSession(my_ssh_session);
		} else {
			fprintf(stdout, "ERRORSSH: Error connecting to %s: %s\n",host,
			ssh_get_error(my_ssh_session));
		}
	}
	return NULL;
}

int sshExec(ssh_session session,char *command,char *out,int len) 
{
	ssh_channel channel;
	int rc;
	char buffer[256];
	unsigned int nbytes;
	int t=0;
	channel = ssh_channel_new(session);
	if	 (channel!=NULL) {
		rc = ssh_channel_open_session(channel);
		if (rc == SSH_OK) {
			rc = ssh_channel_request_exec(channel,command);
			if (rc==SSH_OK) {
				if (out!=NULL) out[0]=0;
				rc=SSH_ERROR;
				nbytes = ssh_channel_read(channel, buffer, sizeof(buffer), 0);
				while (nbytes > 0) {
					if (out==NULL) {
						if (write(STDOUT_FILENO,buffer,nbytes)!=nbytes) { nbytes=-1; break; }
					} else {
						nbytes=min(nbytes,(len-t)); 
						if (nbytes>0) strncat(out,buffer,nbytes);
						t=strlen(out);
					}
					nbytes = ssh_channel_read(channel, buffer, sizeof(buffer), 0);
				}
				if (nbytes>=0) {
					rc=SSH_OK;
					ssh_channel_send_eof(channel);
				}
			}
			ssh_channel_close(channel);
		}
		ssh_channel_free(channel);
	} else rc=SSH_ERROR; 
	return rc;
}

char *sshCommand(char *host,char *com,char *pass,char *buff,int len) {
	ssh_session ssh;

	ssh=openSSHSession(host,"root",pass);
	if (ssh!=NULL) { 
		sshExec(ssh,com,buff,len);
		closeSSHSession(ssh);
	} else return NULL;
	return buff;
}

int scp_copy(ssh_scp scp, char *file,char *dst)
{
	FILE *fp;
	int rc;
	int res=0;
	char *info=NULL;

	fp=fopen(file,"rb");
	if (fp!=NULL) {
		int sz;
		fseek(fp,0L,SEEK_END); sz=ftell(fp); fseek(fp,0L,SEEK_SET);
		info=malloc(sz);
		if (info!=NULL) {
			fread(info,sz,1,fp);
			if (dst!=NULL)	rc = ssh_scp_push_directory(scp, dst, S_IRWXU);
			else				rc = SSH_OK;
			if (rc == SSH_OK) {
				rc = ssh_scp_push_file(scp,file,sz, S_IRUSR | S_IWUSR);
				if (rc == SSH_OK) {
					rc = ssh_scp_write(scp, info, sz);
					if (rc == SSH_OK) res=1;
				}
			}
			free(info);
		}
		fclose(fp);
	}
	return res;
}

int sshCopy(char *host,char *pass,char *file,char *dst) {
	ssh_session ssh;
	ssh_scp scp;
	int res=0;
	int rc;

	ssh=openSSHSession(host,"root",pass);
	if (ssh!=NULL) {
		scp = ssh_scp_new(ssh, SSH_SCP_WRITE | SSH_SCP_RECURSIVE, ".");
		if (scp != NULL) {
			rc = ssh_scp_init(scp);
			if (rc == SSH_OK) {
				res=scp_copy(scp,file,dst);
				ssh_scp_close(scp);
			}
			ssh_scp_free(scp);
		}
		closeSSHSession(ssh);
	} 
	return res;
}

/*
int main(int argc,char *argv[]) {
	ssh_session ssh;
	char buffer[65535];

	ssh=openSSHSession(argv[1],argv[2],argv[3]);
	if (ssh!=NULL) {
		sshExec(ssh,argv[4],buffer);
		closeSSHSession(ssh);
		printf("%s\n",buffer);
	}
}*/
