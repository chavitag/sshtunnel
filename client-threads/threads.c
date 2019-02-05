#include <stdio.h>

#include "threads.h"

#define RUNNING 1
#define END 	2
#define INIT	0

typedef struct tagStatusThread {
	void *(*_thread_function) (int ,void *);
	void *params;
	pthread_t thread_id;
	int pool_id;
	int status;
	void *result;
} StatusThread;


static char __initialized=0;
static StatusThread __poolthread[MAXTHREADS];
static pthread_mutex_t __mutexthread = PTHREAD_MUTEX_INITIALIZER;

static int createThread(ParamsThread *params);
static void *launchThread(void *params);
static int findFreeThread();
static void initializeThreads();

void *thread_function(int thread_id, void *texto);

/** newTread
		Launch a new thread
*/
int newThread(	void *(*_thread_function) (int,void *),void *params) {
	ParamsThread pth;

	pth._thread_function=_thread_function;
	pth.params=params;
	return createThread(&pth);
}

/** endThread
		ends a thread with a result code
*/
void endThread(int id,void *result) {
	__poolthread[id].status=END;
	__poolthread[id].result=result;
	pthread_exit(result);
}

/** joinTread
		waits for thread finalization
*/
int joinThread(int id) {
	int ret;

	if (__poolthread[id].status>0) {
		ret=pthread_join(__poolthread[id].thread_id,NULL);
		__poolthread[id].status=INIT;
		if (ret!=0) return ret;
	}
	return 0;
}

/** joinThreads
		waits for all running threads finalization
*/
int joinThreads() {
	int ret;
	int idx=MAXTHREADS-1;

	while(idx>=0) {
		if (__poolthread[idx].status>0) {
			ret=pthread_join(__poolthread[idx].thread_id,NULL);
			__poolthread[idx].status=INIT;
			if (ret!=0) return ret;
		}
		idx--;
	}
	return 0;
}

/** getIdThread
		returns a thread pthread_t number
*/
pthread_t getIdThread(int id) {
	return __poolthread[id].thread_id;
}

/** getResultThread
		returns the thread execution result
*/
void *getResultThread(int id) {
	void *result=__poolthread[id].result;
	__poolthread[id].status=INIT;
	return result;
}

// ------> Private functions

/** createThread
		Creates and register a new thread
*/
static int createThread(ParamsThread *params) {
	int id;

	pthread_mutex_lock( &__mutexthread );
	if (!__initialized) {
		initializeThreads();
		id=0;
	} else {
		id=findFreeThread();
	}
	if (id>=0) {
		__poolthread[id]._thread_function=params->_thread_function;
		__poolthread[id].params=params->params;
		__poolthread[id].pool_id=id;
		if (pthread_create(&__poolthread[id].thread_id,NULL,launchThread,(void *)((long)id))) {
			__poolthread[id].status=INIT;
			id=-1;
		}
	}
	pthread_mutex_unlock( &__mutexthread );
	return id;
}

/** launchThread
		Method threaded, launch real thread method and recover their result
*/
static void *launchThread(void *params) {
	long id=(long)params;

#ifdef _DEBUG
	printf("Starting service thread %d...\n ",id); fflush(stdout);
#endif

	__poolthread[id].status=RUNNING;
	__poolthread[id].result=__poolthread[id]._thread_function(id,(char *)__poolthread[id].params);
	__poolthread[id].status=END;

#ifdef _DEBUG
	printf("END service thread %d...\n ",id); fflush(stdout);
#endif

	return __poolthread[id].result;
}
 
/** findFreeThread
		Finds free thread slot
*/
static int findFreeThread() {
	int idx=0;
	int runned=-1;
	
	while ((__poolthread[idx].status!=INIT)&&(idx<MAXTHREADS)) {
		if (__poolthread[idx].status==END) runned=idx;
		idx++;
	}
	if (idx==MAXTHREADS) return runned;
	return idx;
}

/** initializeThreads
		Free all thread slots
*/
static void initializeThreads() {
	int idx=0;

	if (__initialized==0) {
		while(idx<MAXTHREADS) {
			__poolthread[idx].thread_id=0;
			__poolthread[idx].status=INIT;
			idx++;
		}
		__initialized=1;
	}
}

//----- Unit Test
/*
void *thread_function(int thread_id, void *texto) {
	for(int idx=0;idx<205;idx++) printf("%d - Soy (%d) %s\n",idx,thread_id,(char *)texto);
	return (void *)121212;
}

void main(void) {
	printf("(%d) \n",newThread(thread_function,(void *)"Thread 1"));
	printf("(%d) \n",newThread(thread_function,(void *)"Thread 2"));
	printf("(%d) \n",newThread(thread_function,(void *)"Thread 3"));
	printf("(%d) \n",newThread(thread_function,(void *)"Thread 4"));
	printf("(%d) \n",newThread(thread_function,(void *)"Thread 5"));
	joinThreads();
	printf("Result IS %d\n",(long)getResultThread(0));
}
*/
