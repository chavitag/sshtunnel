CC=gcc
CFLAGS= -DWITHPTHREADS  

all: tunnelBroker

tunnelBroker: tunnelBroker.c runcmd.o http.o ping.o sshcmd.o tunnel.o computer.o json.o dstring.o threads.o
	$(CC) tunnelBroker.c $(CFLAGS) -o tunnelBroker computer.o tunnel.o sshcmd.o ping.o http.o runcmd.o threads.o dstring.o json.o -lssh -lcurl -lpthread

computer.o: computer.c computer.h
	$(CC) -c $(CFLAGS) computer.c

tunnel.o: tunnel.c tunnel.h
	$(CC) -c $(CFLAGS) tunnel.c

sshcmd.o: sshcmd.c sshcmd.h
	$(CC) -c $(CFLAGS) sshcmd.c

ping.o: ping.c ping.h
	$(CC) -c $(CFLAGS) ping.c

http.o: http.c http.h
	$(CC) -c $(CFLAGS) http.c

runcmd.o: runcmd.c runcmd.h
	$(CC) -c $(CFLAGS) runcmd.c

json.o:	json.c json.h
	$(CC) -c $(CFLAGS) json.c

threads.o: threads.c threads.h
	$(CC) -c $(CFLAGS) threads.c

dstring.o: dstring.c dstring.h
	$(CC) -c $(CFLAGS) dstring.c
