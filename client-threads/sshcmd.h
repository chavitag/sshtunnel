#ifndef __SSHCMDH__
#define __SSHCMDH__

#include <libssh/libssh.h>

#define max(a,b) \
   ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _a : _b; })

#define min(a,b) \
   ({ __typeof__ (a) _a = (a); \
       __typeof__ (b) _b = (b); \
     _a > _b ? _b : _a; })

extern char *sshCommand(char *host,const char *com,const char *user,const char *pass,char *buff,int len);
extern int sshCopy(char *host,const char *user,const char *pass,char *file,char *dst);

extern ssh_session openSSHSession(const char *host,const char *user,const char *pass);
extern int sshExec(ssh_session session,const char *command,char *out,int len);
extern void closeSSHSession(ssh_session session);

#endif
