#ifndef __THREADUTILS_H
#define __THREADUTILS_H

#include <pthread.h>

#define MAXTHREADS 100

typedef struct tagParamsThread {
	void *(*_thread_function) (int, void *);
	void *params;
} ParamsThread;

extern int newThread(void *(*_thread_function) (int,void *),void *params);
extern void endThread(int id,void *result);
extern int joinThread(int id);
extern int joinThreads(void);
extern pthread_t getIdThread(int id);
extern void *getResultThread(int id);

#endif
