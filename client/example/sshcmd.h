#ifndef __SSHCMDH__
#define __SSHCMDH__

#define max(a,b) \
   ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _a : _b; })

#define min(a,b) \
   ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _b : _a; })

void closeSSHSession(ssh_session session);
ssh_session openSSHSession(char *host,char *user,char *pass);
int sshExec(ssh_session session,char *command,char *out,int len);
char *sshCommand(char *host,char *com,char *pass,char *buff,int len);
int sshCopy(char *host,char *pass,char *file,char *dst);

#endif
