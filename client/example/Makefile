base64.o: base64.c
	gcc -c base64.c
sshcmd.o: sshcmd.c sshcmd.h
	gcc -c sshcmd.c
mycrypt.o: mycrypt.c mycrypt.h
	gcc -c mycrypt.c
trim.o: trim.c trim.h
	gcc -c trim.c
xmlutil.o: xmlutil.c xmlutil.h
	gcc -c `xml2-config --cflags` xmlutil.c
genkeys: genkeys.c mycrypt.o
	gcc genkeys.c -o genkeys mycrypt.o -lmcrypt
all: xmlutil.o trim.o mycrypt.o sshcmd.o base64.o
	gcc `xml2-config --libs --cflags` ad_proxy.c -o ad_proxy base64.o mycrypt.o sshcmd.o trim.o xmlutil.o -lmcrypt -lssh
