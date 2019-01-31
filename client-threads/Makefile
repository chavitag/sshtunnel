all: tunnelBroker

tunnelBroker: tunnelBroker.c runcmd.o http.o ping.o sshcmd.o tunnel.o computer.o json.o dstring.o threads.o
	gcc tunnelBroker.c -DWITHPTHREADS -o tunnelBroker computer.o tunnel.o sshcmd.o ping.o http.o runcmd.o threads.o dstring.o json.o -lssh -lcurl -lpthread

computer.o: computer.c computer.h
	gcc -c computer.c

tunnel.o: tunnel.c tunnel.h
	gcc -c tunnel.c

sshcmd.o: sshcmd.c sshcmd.h
	gcc -c sshcmd.c

ping.o: ping.c ping.h
	gcc -c ping.c

http.o: http.c http.h
	gcc -c http.c

runcmd.o: runcmd.c runcmd.h
	gcc -c runcmd.c

json.o:	json.c json.h
	gcc -c -DWITHPTHREADS  json.c

threads.o: threads.c threads.h
	gcc -c threads.c

dstring.o: dstring.c dstring.h
	gcc -c dstring.c
