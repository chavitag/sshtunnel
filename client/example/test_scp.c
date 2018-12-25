#include <libssh/libssh.h>
#include "sshcmd.h"

void main(void) {
	sshCopy("barbol.iesrodeira.com","roottag6866","test_scp.c","/tmp");
}
