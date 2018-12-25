#include <libssh/libssh.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <string.h>
#include <errno.h>
#include <ctype.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/file.h>

       #include <sys/stat.h>
       #include <fcntl.h>



#include "base64.h"
#include "sshcmd.h"
#include "mycrypt.h"

#include "trim.h"
#include "xmlutil.h"

#define true 1
#define false 0

#define IP	"127.0.0.1"
#define HOST "radagast.iesrodeira.com"
#define PORT 22500
#define WORK "/home/xavi/sites/webusers/secrets"

#define MAX_OU_BROTHERS 255

char _host[256];
char *_command_ous="ldbsearch -H /var/lib/samba/private/sam.ldb -b \"%s,dc=asir,dc=iesrodeira,dc=com\" '(objectClass=organizationalUnit)'";
char *_command_groups="ldbsearch -H /var/lib/samba/private/sam.ldb -b \"%s,dc=asir,dc=iesrodeira,dc=com\" '(objectClass=group)'";
char *_command_search="ldbsearch -H /var/lib/samba/private/sam.ldb -b \"%s,dc=asir,dc=iesrodeira,dc=com\" '(objectclass=person)'";

typedef struct tagOU {
	char name[128];
	char group[128];
	int nsons;
	struct tagOU *son_lists[MAX_OU_BROTHERS];
	struct tagOU *father;
} OU;

typedef struct tagUser {
	char recnumber[16];
	char username[32];
	char firstname[64];
	char lastname[64];
	char birthdate[11];
	char address[64];
	char phone[32];
	char phone1[32];
	char ou[512];
} User;

typedef struct tagQuota {
	char name[128];
	int sdisk;
	int hdisk;
	int gdisk;
	int sfiles;
	int hfiles;
	int gfiles;
} Quota;

char *simpleCypher(char *str);
char *simpleUnCypher(char *str);
void sensibleDataCipher(User *user);
void proceso(int );
void atende(int,struct sockaddr_in *);
void send_s_crypt(int skd,char *str,char *iv);
int recv_s_crypt(int skd,char *buffer,int len,char *iv);



void outdebug(char *txt) {
	FILE *fp;

	fp=fopen("/tmp/odbg","ab"); fwrite(txt,strlen(txt),1,fp); fclose(fp);
}

void send_s_crypt(int skd,char *str,char *iv) {
	char *info;
	int len=strlen(str)+1; 
	info=s_cypher(str,len,"secret.key",iv);
   send(skd,info,len+_blksz,0);
	free(info);
}

int recv_s_crypt(int skd,char *buffer,int len,char *iv) {
	char *info;
	int r=recv(skd,buffer,len,0);
   if (r>0) {
   	info=s_decypher(buffer,r,"secret.key",iv);
      r=min(r,len);
	   memcpy(buffer,info,r);
   	free(info);
      buffer[r]=0;
      r=strlen(buffer);
   }
	return r;
} 

void secstrcat(char *dst,char *src,int len) {
	int c=min(strlen(dst)-len,strlen(src));
	strncat(dst,src,c);
}

char *extraeInfo(char *block,char *id,char *buffer,int lenbuf) {
	char myblock[65535]; strcpy(buffer,"-");
	strncpy(myblock,block,sizeof(myblock));
	char *init=strstr(myblock,id); 
   if (init!=NULL) {
     	char *end=strstr(init,"\n"); 
		if (end!=NULL) {
			char *dp=strstr(init+strlen(id)+1,":"); 
			char *nend=strstr((end+1),"\n"); 
			while ((nend!=NULL)&&((nend<dp)||(dp==NULL))) {
				unsigned long nbytes;
				if (dp==NULL) 	nbytes=strlen(end)-1;
				else 		nbytes=(unsigned long)(dp-(end+2)); 
				if (nbytes<=0) break;
				memmove(end,(end+2),nbytes);
				end=nend-2;
				nend=strstr((end+2),"\n"); 
			}
		}
		if (end!=NULL) *end=0;
      init+=strlen(id); 
      if (*init==':') { 
        unBase64(buffer,lenbuf,(init+2),strlen(init)-2);
      }
      else strncpy(buffer,init,lenbuf);
		
		if (end!=NULL) *end='\n';
	}
	return buffer;
}

#define avanza(qinfo,end) qinfo=end+1;  while(*qinfo<=32) qinfo++; end=qinfo; while(*end>32) end++; *end=0

void setXMLQuotas(char *user,char *quotas,char *xml,int len) {
	char *status="--";
	char *d_usage="0";
	char *d_soft="0";
	char *d_hard="0";
	char *d_grace="0";
	char *f_usage="0";
	char *f_soft="0";
	char *f_hard="0";
	char *f_grace="0";
	char _bufcuota[65535];
	char line[1024];

	secstrcat(xml,"<quotas>",len); 
	if (quotas!=NULL) { 


		strncpy(_bufcuota,quotas,sizeof(_bufcuota));
		char *device=strstr(_bufcuota,"###"); 
		while (device!=NULL) {
			device+=3;
			status="--";
			d_usage="0";
			d_soft="0";
			d_hard="0";
			d_grace="0";
			f_usage="0";
			f_soft="0";
			f_hard="0";
			f_grace="0";

			char *end=strstr(device,"###"); 
			if (end==NULL) break;
			*end=0; 
			secstrcat(xml,"<filesystem name='",len);secstrcat(xml,trim(device),len);	secstrcat(xml,"' alias=''>",len); 
			device=end+3; 	
			char *qinfo=strstr(device,user); 
			if (qinfo!=NULL) {
				int num;
				char *el=strstr(qinfo,"\n"); 
				if (el==NULL) 	num=strlen(qinfo);
				else				num=el-qinfo;
					strncpy(line,qinfo,num); line[num]=0; qinfo=line; 
					end=qinfo+strlen(user);
					avanza(qinfo,end);
					status=qinfo; 
					avanza(qinfo,end); d_usage=qinfo; avanza(qinfo,end); d_soft=qinfo; avanza(qinfo,end); 
					d_hard=qinfo; avanza(qinfo,end); d_grace=qinfo;
					avanza(qinfo,end); f_usage=qinfo; avanza(qinfo,end); f_soft=qinfo; avanza(qinfo,end); 
					f_hard=qinfo; avanza(qinfo,end); f_grace=qinfo;
			}
			secstrcat(xml,"<status>",len); secstrcat(xml,status,len); secstrcat(xml,"</status>",len);
			secstrcat(xml,"<disk>",len); 
			secstrcat(xml,"<usage>",len); secstrcat(xml,d_usage,len); secstrcat(xml,"</usage>",len);
			secstrcat(xml,"<soft>",len); secstrcat(xml,d_soft,len); secstrcat(xml,"</soft>",len);
			secstrcat(xml,"<hard>",len); secstrcat(xml,d_hard,len); secstrcat(xml,"</hard>",len);
			secstrcat(xml,"<grace>",len); secstrcat(xml,d_grace,len); secstrcat(xml,"</grace>",len);
			secstrcat(xml,"</disk>",len);
			secstrcat(xml,"<files>",len); 
			secstrcat(xml,"<usage>",len); secstrcat(xml,f_usage,len); secstrcat(xml,"</usage>",len);
			secstrcat(xml,"<soft>",len); secstrcat(xml,f_soft,len); secstrcat(xml,"</soft>",len);
			secstrcat(xml,"<hard>",len); secstrcat(xml,f_hard,len); secstrcat(xml,"</hard>",len);
			secstrcat(xml,"<grace>",len); secstrcat(xml,f_grace,len); secstrcat(xml,"</grace>",len);
			secstrcat(xml,"</files>",len);
		
			secstrcat(xml,"</filesystem>",len); 
			device=strstr(device,"###");
		}
	}
	secstrcat(xml,"</quotas>",len);

}

//TODO: Descifrar info cifrada
//http://www.codealias.info/technotes/des_encryption_using_openssl_a_simple_example
void userToXML(char *info,char *xml,char *quotas,int len) {
   char _buf[16384];
   //int isprofe=false;
	char *qinfo=NULL;
	char *trimstr=NULL;
	
extraeInfo(info,"userAccountControl:",_buf,sizeof(_buf));
	int value=atoi(trim(_buf)); 
   extraeInfo(info,"title:",_buf,sizeof(_buf));
   //if (strcmp(_buf,"-")==0) isprofe=true;
   secstrcat(xml,"<user number='",len); secstrcat(xml,trim(_buf),len); 
	if (value&0x02) secstrcat(xml,"' status='disabled'",len);
	else				 secstrcat(xml,"' status='enabled'",len);

	secstrcat(xml,">",len);
	
	if (value&0x10000) 	secstrcat(xml,"<password type='noexpire'>",len);
	else						secstrcat(xml,"<password type='normal'>",len);
	if (value&0x800000)	secstrcat(xml,"expired",len);
	else						secstrcat(xml,"active",len);
	secstrcat(xml,"</password>",len);
   extraeInfo(info,"sAMAccountName:",_buf,sizeof(_buf));
	
	trimstr=trim(_buf);
   secstrcat(xml,"<username>",len); secstrcat(xml,trimstr,len); secstrcat(xml,"</username>",len); 
	setXMLQuotas(trimstr,quotas,xml,len);

	extraeInfo(info,"dn:",_buf,sizeof(_buf));
	trimstr=strstr(_buf,"OU=");
	if (trimstr!=NULL) qinfo=strstr(trimstr,"CN=");
	if (qinfo!=NULL) *qinfo=0;
	secstrcat(xml,"<ou>",len); secstrcat(xml,trimstr,len); secstrcat(xml,"</ou>",len);

   extraeInfo(info,"sn:",_buf,sizeof(_buf));
   /*if (isprofe) secstrcat(xml,"<lastname>",len);
   else secstrcat(xml,"<firstname>",len); */
   secstrcat(xml,"<firstname>",len);

   secstrcat(xml,trim(_buf),len); 
   /*if (isprofe) secstrcat(xml,"</lastname>",len);
   else secstrcat(xml,"</firstname>",len);*/
   secstrcat(xml,"</firstname>",len);

   extraeInfo(info,"givenName:",_buf,sizeof(_buf));

   /*if (isprofe) secstrcat(xml,"<firstname>",len);
   else   secstrcat(xml,"<lastname>",len); */
  secstrcat(xml,"<lastname>",len);

	secstrcat(xml,trim(_buf),len); 
  
/* if (isprofe) secstrcat(xml,"</firstname>",len);
   else secstrcat(xml,"</lastname>",len);*/
secstrcat(xml,"</lastname>",len);

   extraeInfo(info,"department:",_buf,sizeof(_buf)); simpleUnCypher(_buf); 
   secstrcat(xml,"<birthdate>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</birthdate>",len);
   extraeInfo(info,"physicalDeliveryOfficeName:",_buf,sizeof(_buf)); simpleUnCypher(_buf); 
   secstrcat(xml,"<address>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</address>",len);
   extraeInfo(info,"telephoneNumber:",_buf,sizeof(_buf)); simpleUnCypher(_buf); 
   secstrcat(xml,"<phone>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</phone>",len);
   extraeInfo(info,"description:",_buf,sizeof(_buf)); simpleUnCypher(_buf);
   secstrcat(xml,"<phone1>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</phone1>",len);
   extraeInfo(info,"objectSid:",_buf,sizeof(_buf)); simpleUnCypher(_buf);
   secstrcat(xml,"<sid>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</sid>",len);
   extraeInfo(info,"objectGUID:",_buf,sizeof(_buf)); simpleUnCypher(_buf);
   secstrcat(xml,"<guid>",len); secstrcat(xml,trim(_buf),len); secstrcat(xml,"</guid>",len);
   secstrcat(xml,"</user>",len);
}

void usersToXML(char *info,char *xml,int len) {

	char *quotas=strstr(info,"### QUOTAS ###");
	if (quotas!=NULL) {
			*quotas=0;
			quotas+=14;
	}
   strcpy(xml,"<users>");
   char *s=strtok(info,"#");
	while (s!=NULL) {
		if (strncmp(" record ",s,8)==0) {
         userToXML(s,xml,quotas,len);
		}
		s=strtok(NULL,"#");
	}
   secstrcat(xml,"</users>",len);
}

void ouToTree(char *info,OU *root) {
	char _buf[1024];
	OU *novo=NULL;
	char *s;
	int idx=0;
	int level=0;

	//printf("Extracting Info\n");
	extraeInfo(info,"distinguishedName:",_buf,sizeof(_buf));
	//printf("Procesando %s\n",_buf);
	//char *end=strstr(_buf,",OU=ASIR");
	char *end=strstr(_buf,",DC=");
	if (end!=NULL) {
		do {
			s=end;
			*s=0;
			//printf("Fragment %s\n",s);
			// Buscamos o inicio da palabra 
			while ((*s!='=')&&(s!=_buf)) s--;
			if (s==_buf) break;
			s++;
			if (level==0) {
				// Si o nivel e o 0, poñemos o nome
				strncpy(root->name,s,sizeof(root->name)); level++;
				//printf("ROOT %s\n",root->name);
			}
			else {
				// Si o nivel non e o 0, miramos si  non temos fillos xa con ese nome. 
				for(idx=0;(idx<root->nsons)&&(strcmp(root->son_lists[idx]->name,s)!=0);idx++);
				if ((idx<MAX_OU_BROTHERS)&&(idx==root->nsons)) {
					// Engadimos o novo fillo
					novo=malloc(sizeof(OU));
					if (novo!=NULL) {
						root->nsons++;
						novo->nsons=0;
						novo->group[0]=0;
						novo->father=root;
						//printf("SON %s\n",s);
						strncpy(novo->name,s,sizeof(novo->name));
						root->son_lists[idx]=novo;
					}
				}
				// Seguinte nivel
				root=root->son_lists[idx];
				//printf("Next level %s\n",root->name);
			}
			// Buscamos a seguinte entrada
			*end=','; end=s;
			while((*end!=',')&&(end!=_buf)) end--;
		} while(end!=_buf);
		//printf("End Process %s\n",end);
	}
	//printf("End Extract!!!\n");
}

void freeOU(OU *r) {
	int nx;
	for (nx=0;nx<r->nsons;nx++) {
		freeOU(r->son_lists[nx]);
	}
	if (r->father!=NULL) free(r);
}

void ouNodeXML(OU *node,char *xml,int len) {
	int idx;
	
	secstrcat(xml,"<ou>",len); 
	//printf("Procesando %s\n",node->name);
	secstrcat(xml,"<name>",len); secstrcat(xml,node->name,len); secstrcat(xml,"</name>",len);
	if (node->group[0]!=0) {
		secstrcat(xml,"<group>",len); secstrcat(xml,node->group,len); secstrcat(xml,"</group>",len);
	}
	for(idx=0;idx<node->nsons;idx++) {
		ouNodeXML(node->son_lists[idx],xml,len);
	}
	secstrcat(xml,"</ou>",len);
}

OU *getTreeNode(OU *tree,char *name) {
	OU *node;
	int idx;
	//printf("Buscando *%s* temos *%s*\n",name,tree->name);
	if (strcmp(tree->name,name)==0) return tree;
	for (idx=0;idx<tree->nsons;idx++) {
		node=getTreeNode(tree->son_lists[idx],name);
		if (node!=NULL) return node;
	}
	return NULL;
}

void insertInTree(OU *tree,char *info) {
	char buf[1024];
	char workbuff[1024];
	char *init;
	char *end;
	char *pos;

	strncpy(workbuff,info,sizeof(workbuff));
	snprintf(buf,sizeof(buf),",OU=%s",tree->name);
	//printf("****\nRoot name %s\n",buf);
	//printf("Inserting %s\n****\n",workbuff);
	init=strstr(workbuff,buf);
	if (init!=NULL) {
		*init=0; 
		//printf("Extracting from %s\n",workbuff);
		pos=init-1; 
		init=strstr(workbuff,"CN=");
		if (init!=NULL) {
			init+=3;
			end=strstr(init,",");
			if (end!=NULL) {
				*end=0;
				end++;
			}
			//printf("GROUP: %s\n",init); 
			end=init+strlen(init);
			while(pos>end) {
				while((*pos)!='=') pos--;
				//printf("Temos %s\n",(pos+1));
				tree=getTreeNode(tree,(pos+1));
				if (tree==NULL) break;
				while((*pos)!=',') pos--;
				if (pos>end) *pos=0;
			}
		}
	}
	if (tree!=NULL) {
		//printf("Engadimos o grupo (%s) ao nodo %s\n",init,tree->name);
		if (tree->group[0]!=0) secstrcat(tree->group,"#",sizeof(tree->group));
		secstrcat(tree->group,init,sizeof(tree->group));
	}
}

void ousToXML(char *info,char *info1,char *xml,int len) {
	OU root;
	int idx;
	char _buf[1024];

	//printf("Scanning OUS\n");
	root.nsons=0;
	root.father=NULL;
	root.name[0]=0;
	root.group[0]=0;
   char *s=strtok(info,"#");
	while (s!=NULL) {
		//printf("CALLING %s\n",s);
		if (strncmp(" record ",s,8)==0) {
			//printf("letsgo\n");
         ouToTree(s,&root);
			//printf("done\n");
		}
		//printf("next\n");
		s=strtok(NULL,"#");
	} 

	s=strtok(info1,"#");
	while (s!=NULL) {
		if (strncmp(" record ",s,8)==0) {
			//printf("############ Scanning\n %s\n #############\n",s);
			extraeInfo(s,"dn:",_buf,sizeof(_buf));
			//printf("------->%s\n",_buf);
			insertInTree(&root,_buf);
		}
		s=strtok(NULL,"#");
	}

	//printf("XML generation\n");
	strcpy(xml,"<ou>"); 
	//printf("Nodo Raíz %s\n",root.name);
	secstrcat(xml,"<name>",len); secstrcat(xml,root.name,len); secstrcat(xml,"</name>",len);
	if (root.group[0]!=0) {
		secstrcat(xml,"<group>",len); secstrcat(xml,root.group,len); secstrcat(xml,"</group>",len);
	}
	for(idx=0;idx<root.nsons;idx++) {
		ouNodeXML(root.son_lists[idx],xml,len);
	}
	secstrcat(xml,"</ou>",len);
	freeOU(&root);
	//printf("%s\n",xml);
}

char *extractFromCommandline(char *cmd,char *field,char *buffer,int len) {
	char temp[65535];
	strncpy(temp,cmd,sizeof(temp));
	char *str=strstr(temp,field); 
	if (str!=NULL) {
		printf("ATOPADO!!! %s\n",str);
		str=strstr(str,"\""); 
		if (str!=NULL) {
			str++;
			printf("COMENZO INFO %s\n",str);
			char *end=strstr(str,"\"");
			if (end!=NULL) {
				*end=0;
				printf("Resultado: %s\n",str);
				strncpy(buffer,str,len);
				return buffer;		
			} 
		}
	}
	return NULL;
}

int extraePass(char *item,char *datos[]) {
	//newpass
		char *pass=item;
		//ndias
		char *ndias=strstr(pass,",");
		if (ndias!=NULL) {
			*ndias=0; ndias++;
			// expire
			char *expire=strstr(ndias,","); 
			if (expire!=NULL) {
				*expire=0; expire++;
				// change
				char *change=strstr(expire,",");
				if (change!=NULL) { 
					*change=0; change++; 
					datos[0]=pass;
					if (atoi(ndias)==0) ndias="0";
				   datos[1]=ndias; 
					datos[2]=expire;
					datos[3]=change; 
					return 1;
				}
			}
	}
	return 0;
}

int getUserField(xmlDocPtr xmldoc,char *num, char *field,char *buffer,int len) {
	char searchstr[512];
	char **data;

	snprintf(searchstr,sizeof(searchstr),"//user[@number = '%s']/%s",num,field);
	data=execXPath(xmldoc,searchstr); 
	if (data==NULL) return false;
	if (data[0]!=NULL) strncpy(buffer,data[0],len);
	freeXPath(data);
	return true;
}

int getQuotaField(xmlDocPtr xmldoc,User *user,char *fsys,char *field,int *value) {
	char searchstr[512];
	char **data;

	snprintf(searchstr,sizeof(searchstr),"//user[@number = %s]/quotas/filesystem[@name = '%s']/%s",user->recnumber,fsys,field);
	data=execXPath(xmldoc,searchstr); 
	if (data==NULL) return false;
	if (data[0]!=NULL) *value=atoi(data[0]);
	freeXPath(data);
	return true;
}


int getUserQuota(xmlDocPtr xmldoc,User *user,char *fsys,Quota *quota) {
	int ret=true;
	strncpy(quota->name,fsys,sizeof(quota->name));
	ret=ret && getQuotaField(xmldoc,user,fsys,"disk/soft",&quota->sdisk);
	ret=ret && getQuotaField(xmldoc,user,fsys,"disk/hard",&quota->hdisk);
	ret=ret && getQuotaField(xmldoc,user,fsys,"disk/grace",&quota->gdisk);
	ret=ret && getQuotaField(xmldoc,user,fsys,"files/soft",&quota->sfiles);
	ret=ret && getQuotaField(xmldoc,user,fsys,"files/hard",&quota->hfiles);
	ret=ret && getQuotaField(xmldoc,user,fsys,"files/grace",&quota->gfiles);
	return ret;
}

char **getUserFilesystems (xmlDocPtr xmldoc,User *user) {
	char searchstr[512];

	snprintf(searchstr,sizeof(searchstr),"//user[@number = %s]/quotas/filesystem/@name",user->recnumber);
	return execXPath(xmldoc,searchstr); 
}

char **getUserGroups(xmlDocPtr xmldoc,char *num) {
	char searchstr[512];

	snprintf(searchstr,sizeof(searchstr),"//user[@number = %s]/groups/name",num);
	return execXPath(xmldoc,searchstr); 
}

void initUser(User *user) {
	strcpy(user->recnumber,"-");
	strcpy(user->username,"-");
	strcpy(user->firstname,"-");
	strcpy(user->lastname,"-");
	strcpy(user->birthdate,"-");
	strcpy(user->address,"-");
	strcpy(user->phone,"-");
	strcpy(user->phone1,"-");
	strcpy(user->ou,"-");
}

char *simpleUnCypher(char *str) {

	int x;
	//for(x=0;x<strlen(str);x++) str[x]--;
	return str;
}

char *simpleCypher(char *str) {

	int x;
	//for(x=0;x<strlen(str);x++) str[x]++;
	return str;
}

//TODO:
void sensibleDataCipher(User *user) {
//TODO: Cifrar datos importantes
//http://www.codealias.info/technotes/des_encryption_using_openssl_a_simple_example
	simpleCypher(user->birthdate);
	simpleCypher(user->address);
	simpleCypher(user->phone);
	simpleCypher(user->phone1);
}

int fillUser(xmlDocPtr xmldoc, char *num, User *user) {
	char searchstr[512];
	initUser(user);
	strncpy(user->recnumber,num,sizeof(user->recnumber));
	if (!getUserField(xmldoc,num,"username",user->username,sizeof(user->username))) return false;
	if (!getUserField(xmldoc,num,"firstname",user->firstname,sizeof(user->firstname))) return false;
	if (!getUserField(xmldoc,num,"lastname",user->lastname,sizeof(user->lastname))) return false;
	if (!getUserField(xmldoc,num,"birthdate",user->birthdate,sizeof(user->birthdate))) return false; //TODO: Cifrar
	if (!getUserField(xmldoc,num,"address",user->address,sizeof(user->address))) return false;		 //TODO: Cifrar
	if (!getUserField(xmldoc,num,"phone",user->phone,sizeof(user->phone))) return false;				 //TODO: Cifrar
	if (!getUserField(xmldoc,num,"phone1",user->phone1,sizeof(user->phone1))) return false;			 //TODO: Cifrar
	if (!getUserField(xmldoc,num,"ou",user->ou,sizeof(user->ou))) return false;							 
	sensibleDataCipher(user);
	return true;
}


void createUsers(int skd,char *xml,char *secpass) {
	char buffer[65535];
	char cmdbuff[1024];
	xmlDocPtr xmldoc;
	char **info;
	char *msg="ERROR: Erro Indetermiñado engadindo Usuarios";
	FILE *fp;
	char *tmp=tmpnam (NULL);
	int ok=false;
	User user;
	Quota quota;
	int idx=0;
	char *maingroup="Domain Users";
	char **groups;
	char **fsys;
	int j;

	xmldoc=parseXML(xml,strlen(xml),"newusers.xml");
	if (xmldoc!=NULL) {
		info=execXPath(xmldoc,"//user/@number"); 
		if (info!=NULL) {
			fp=fopen(tmp,"wb+");
			if (fp!=NULL) {
				idx=0; ok=true; 
				while(info[idx]) { 
					ok=ok && fillUser(xmldoc,info[idx],&user);
					if (!ok) break;
					sensibleDataCipher(&user);
					//fprintf(fp,"samba-tool user create %s abc123. --given-name=\"%s\" --surname=\"%s\" --home-directory=\"\\\\\\\\RADAGAST\\\\Datos\\\\%s\" --home-drive=Z --userou=\"%s\" --job-title=\"%s\" --telephone-number=\"%s\" --description=\"%s\" --physical-delivery-office=\"%s\" --department=\"%s\" --must-change-at-next-login\n",user.username,user.lastname,user.firstname,user.username,user.ou,info[idx],user.phone,user.phone1,user.address,user.birthdate);
					fprintf(fp,"samba-tool user create %s abc123. --given-name=\"%s\" --surname=\"%s\" --home-directory=\"\\\\\\\\RADAGAST\\\\Datos\\\\%s\" --home-drive=Z --userou=\"%s\" --must-change-at-next-login\n",user.username,user.lastname,user.firstname,user.username,user.ou);
					//fprintf(fp,"samba-tool user setexpiry --noexpiry %s\n",user.username);
					fprintf(fp,"mkdir /SAMBA/datos/info/%s\n",user.username);
					groups=getUserGroups(xmldoc,info[idx]);
					if (groups!=NULL) {
						j=0;
						while(groups[j]!=NULL) { 
							fprintf(fp,"samba-tool group addmembers %s %s\n",groups[j],user.username);
							printf("Group %s\n",groups[j]); j++;
						}
						if (j>0) maingroup=groups[j-1];
					}
					snprintf(buffer,sizeof(buffer),"CN=%s %s,%s,DC=asir,DC=iesrodeira,DC=com",user.lastname,user.firstname,user.ou);

//printf("Insertando usuario DN:-->%s,%s\n",buffer,maingroup);
					fprintf(fp,"/root/webuserscripts/set_primarygroup.sh \"%s\" \"%s\"\n",buffer,maingroup);
					fprintf(fp,"chown \"ASIR\\\\%s:ASIR\\\\%s\" /SAMBA/datos/info/%s\n",user.username,maingroup,user.username);
					fprintf(fp,"ldbmodify --url=/var/lib/samba/private/sam.ldb -b dc=asir,dc=iesrodeira,dc=com /tmp/setpgroup\n");
					if (groups!=NULL) freeXPath(groups);
					fsys=getUserFilesystems(xmldoc,&user);
					if (fsys!=NULL) {
						j=0;
						while(fsys[j]!=NULL) {
							if (getUserQuota(xmldoc,&user,fsys[j],&quota)) {
								fprintf(fp,"setquota -u %s %d %d %d %d %s\n",user.username,quota.sdisk,quota.hdisk,quota.sfiles,quota.hfiles,fsys[j]);
							}
							j++;
						}
						freeXPath(fsys);
					}
					idx++;
				}
				fclose(fp);
			}
			freeXPath(info);
		}
		closeXML(xmldoc);

		if (idx>0) {
			sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
			snprintf(cmdbuff,sizeof(cmdbuff),"bash .tmpadp/%s &>/tmp/outcmd && cat /tmp/outcmd ",strstr(tmp+1,"/")+1);

			sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
			//fp=fopen("/tmp/debug","wb"); fwrite(buffer,strlen(buffer),1,fp); fclose(fp);
			char *c=strstr(buffer,"created successfully"); 
			j=0;
			while(c!=NULL) {
				j++;
				c=strstr((c+12),"created successfully");
			}
			if (idx==j) sprintf(buffer,"OK: %d Usuarios Creados",j);
			else		   sprintf(buffer,"ERROR: Crearonse %d Usuarios de %d",j,idx);
			msg=buffer;
			remove(tmp);
		} else msg="OK: Sen Usuarios Novos";
		
	}
	send(skd,msg,strlen(msg),0);
}

char *moveUsers(char *secpass,char *command,int len) {
	char **destination;
	char **setgroups;
	char **ngroups;
	char **users;
	char **dn;
	char **ou;
	char *newpgroup=NULL;
	int idx,idx1;
	xmlDocPtr xmldoc;
	FILE *fp=NULL;
	char *tmp=NULL;
	char *msg="ERROR: Comando erróneo";	

	xmldoc=parseXML(command,strlen(command),"command.xml");
	if (xmldoc!=NULL) {
		destination=execXPath(xmldoc,"//parameter[@name='destination']");
		setgroups=execXPath(xmldoc,"//parameter[@name='setgroups']");
		ngroups=execXPath(xmldoc,"//parameter[@name='groups']/name");
		users=execXPath(xmldoc,"//parameter[@name='user']/@id");
		if ((destination!=NULL)&&(setgroups!=NULL)&&(users!=NULL)) {
			msg="ERROR: Imposible crear comando";
			tmp=tmpnam(NULL);
			if ((tmp!=NULL)&&((fp=fopen(tmp,"wb"))!=NULL)) {
				idx=0;
				while(users[idx]!=NULL) { 
					sprintf(command,"//parameter[@id='%s']/dn",users[idx]);
					dn=execXPath(xmldoc,command);  
					if (dn!=NULL) { 
						sprintf(command,"//parameter[@id='%s']/ou",users[idx]);
						ou=execXPath(xmldoc,command);
						if (ou!=NULL) {				
							fprintf(fp,"bash /root/webuserscripts/move_ou.sh \"%s\" \"%s\" \"%s,%s\"\n",dn[0],destination[0],dn[0],ou[0]);
							if (!strcmp(setgroups[0],"true")) {
								fprintf(fp,"bash /root/webuserscripts/set_primarygroup.sh \"%s,%s\" \"Domain Users\"\n",dn[0],ou[0]);
								fprintf(fp,"sleep 1\n");
								fprintf(fp,"ldbmodify --url=/var/lib/samba/private/sam.ldb -b dc=asir,dc=iesrodeira,dc=com /tmp/setpgroup\n");
								// move ou
								fprintf(fp,"ldbmodify --url=/var/lib/samba/private/sam.ldb -b dc=asir,dc=iesrodeira,dc=com /tmp/moddn\n");
								fprintf(fp,"chown \"ASIR\\\\%s:ASIR\\\\Domain Users\" /SAMBA/datos/info/%s\n",users[idx],users[idx]);
								// Change groups && perms
								fprintf(fp,"bash /root/webuserscripts/clean_groups.sh %s\n",users[idx]);
								if (ngroups!=NULL) {
									idx1=0;
									while(ngroups[idx1]!=NULL) {
										fprintf(fp,"samba-tool group addmembers %s %s\n",ngroups[idx1],users[idx]);
										idx1++;
									}
									if (idx1>0) {
										// Set new pgroup
										newpgroup=ngroups[idx1-1];
										fprintf(fp,"bash /root/webuserscripts/set_primarygroup.sh \"%s,%s\" \"%s\"\n",dn[0],destination[0],newpgroup);
										fprintf(fp,"chown \"ASIR\\\\%s:ASIR\\\\%s\" /SAMBA/datos/info/%s\n",users[idx],newpgroup,users[idx]);
										fprintf(fp,"ldbmodify --url=/var/lib/samba/private/sam.ldb -b dc=asir,dc=iesrodeira,dc=com /tmp/setpgroup\n");
									}
								}
							} else {
								// move ou
								fprintf(fp,"sleep 1\n");
								fprintf(fp,"ldbmodify --url=/var/lib/samba/private/sam.ldb -b dc=asir,dc=iesrodeira,dc=com /tmp/moddn\n");
							}
						}
					}
					freeXPath(dn);
					freeXPath(ou);
					if ((dn==NULL)||(ou==NULL)) break;
					idx++;
				}
				fclose(fp);
				sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
				snprintf(command,len,"bash .tmpadp/%s &>/tmp/outcmd && cat /tmp/outcmd && rm -Rf .tmpadp",strstr(tmp+1,"/")+1);
				sshCommand(HOST,command,secpass,command,len);
				remove(tmp); idx1=0;
				tmp=strstr(command,"Modified 1");
				while(tmp!=NULL) { 
					tmp+=10; idx1++; tmp=strstr(tmp,"Modified 1");
				}
				idx1=idx1/3;
				if (idx==idx1) snprintf(command,len,"OK: Movéronse %d Usuarios\n",idx);
				else				snprintf(command,len,"ERROR: Movéronse %d Usuarios de %d\n",idx1,idx);
				msg=command;
			}
			freeXPath(users);
			freeXPath(destination);
			freeXPath(setgroups);
			freeXPath(ngroups);
		}
		closeXML(xmldoc);
	}
	return msg;
}


char buffer[100000000];
char buffxml[100000000];
void atende(int skd,struct sockaddr_in *addr)
{
   char iv[16];
   char secpass[64];
   char *cmd;
   char *code;
   char *crbuff;
   ssh_session ssh;
   char cmdbuff[65535];
	char buffer1[65535];

   fillRandom(iv,16);
   code=init_s_cypher("secret.key");	// chave de cifrado aleatoria....
   recv(skd, buffer,sizeof(buffer),0);
   crbuff=decrypt(buffer,64,(code+64),crypt_key(),32); // Desciframos a información recibida empregando a chave de cifrado...

   getSecureKey("authority.db",buffer);	// Authority.db conten Administrator

   if (strncmp(buffer,crbuff,strlen(buffer))!=0) {
	   send(skd,"Access Denied!!",15,0);
	   free(crbuff);
	   close(skd);
   	return;
   } 
   free(crbuff);

   // iv pode ter "ceros"
   crbuff=s_cypher(iv,16,"secret.key",NULL);  // Enviando semilla de cifrado para a sesión cifrada coa chave de cifrado aleatoria

   send(skd,crbuff,32,0); 
   free(crbuff);
   getSecureKey("secomm.db",secpass);  //secomm.db conten a pass do AD

   do { 
		int nc=recv(skd,buffer,sizeof(buffer),0);
      if (nc>0) { 
			buffer[nc]=0;
   	   if (strncmp(buffer,"exit",4)==0) break;
   	   else if (strncmp(buffer,"GETDOMUSERS:",12)==0) { 
				strcpy(buffxml,"ERROR: Imposible Leer Información do A.D.");
            // ou=Curso 2014-2015,ou=Rexime Ordinario,ou=Alumnos
            char *b=trim(strstr(buffer,":")+1);
				if (b!=NULL) {
					//TODO: Coller cuotas
					char *quota=strstr(b,"#");
					if (quota!=NULL) { *quota=0; quota++; }
		         snprintf(cmdbuff,sizeof(cmdbuff),_command_search,b); 

					if (quota!=NULL) {
						secstrcat(cmdbuff,"&& echo \"### QUOTAS ###\"",sizeof(cmdbuff));
						char *qline=strtok(quota,"#");
						while(qline!=NULL) {
							snprintf(buffer1,sizeof(buffer1)," && echo \"### %s ###\" && repquota -v -p %s",qline,qline);
							secstrcat(cmdbuff,buffer1,sizeof(cmdbuff));
							qline=strtok(NULL,"#");
						}
					}
		         sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));  
		         usersToXML(buffer,buffxml,sizeof(buffxml)); 
				}
		char count[10];
		snprintf(count,10,"%d",strlen(buffxml));
		send(skd,count,10,0); 
   	   	send(skd,buffxml,strlen(buffxml),0);
	  	   } else if (strncmp(buffer,"CHANGEPASS:",11)==0) {
				char *datos[4];
				int ok=0;
				int lpass;
				char *msg="ERROR: Imposible cambiar a password";

				char *tmp=tmpnam(NULL); 
				if (tmp!=NULL) {
					FILE *fp=fopen(tmp,"wb+");
					if (fp!=NULL) { 
						char *b=trim(strstr(buffer,":")+1);
						char *users=strstr(b,"~"); 
						if (users!=NULL) {
							*users=0; users++;
							if (extraePass(b,datos)) {
								char *nlogin="--must-change-at-next-login"; 
								lpass=strlen(trim(datos[0]));					 // pass
								if (strcmp(trim(datos[3]),"true")!=0) nlogin=""; // no change next login
								char *user=strtok(users,",");
								while(user!=NULL) { 
									if (lpass>0) {
										fprintf(fp,"samba-tool user setpassword %s --newpassword=%s %s 2>&1\n",user,datos[0],nlogin);
										if (!strcmp(nlogin,"--must-change-at-next-login")) 
											fprintf(fp,"samba-tool user setexpiry %s --days=0\n",user);
									}
									if (!strcmp(datos[2],"true")) 
											fprintf(fp,"samba-tool user setexpiry --noexpiry %s\n",user);
									else 
											fprintf(fp,"samba-tool user setexpiry %s --days=%d\n",user,atoi(datos[1]));
									ok=1;
									user=strtok(NULL,",");
								}
							}
						}
						fclose(fp);
						if (ok) {
							sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
							snprintf(cmdbuff,sizeof(cmdbuff),"bash .tmpadp/%s &> /tmp/outcmd && cat /tmp/outcmd && rm -Rf .tmpadp",strstr(tmp+1,"/")+1);
							sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
							if (strstr(buffer,"OK")!=NULL) strcpy(buffer,"OK: Datos Modificados");
							else if (strstr(buffer,"0000052D")!=NULL) strcpy(buffer,"ERROR: A password debe ser máis complexa");
							else	if (lpass>0) sprintf(buffer,"ERROR: Imposible cambiar a password");
							else strcpy(buffer,"OK: A Password non Cambiou<br/>Datos Modificados");
							msg=buffer;
						}
						remove(tmp);
					}
				}
				send(skd,msg,strlen(msg),0);
			} else if (strncmp(buffer,"DELUSERS:",9)==0) {
				char *b=trim(strstr(buffer,":")+1);
				char *tmp=tmpnam (NULL); 
				char *backup=strstr(b,"#"); 
				int dobkup=0;
				if (backup!=NULL) {
					*backup=0; 
					backup++;
					dobkup=(strcmp(backup,"true")==0);
				}

				int numusers=0;
				FILE *fp=fopen(tmp,"wb+");
				if (fp!=NULL) {
					char *un=strtok(b,",");
					while(un!=NULL) {
						fprintf(fp,"bash /root/webuserscripts/del_user.sh %s\n",un);
						if (dobkup) fprintf(fp,"tar -cjf \"/SAMBA/datos/backups/`date`_%s\" /SAMBA/datos/info/%s\n",un,un);
						fprintf(fp,"rm -Rf /SAMBA/datos/info/%s\n",un);
						un=strtok(NULL,",");
						numusers++;
					}
					fclose(fp);
					sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
					snprintf(cmdbuff,sizeof(cmdbuff),"bash .tmpadp/%s &>/tmp/outcmd && cat /tmp/outcmd && rm -Rf .tmpadp",strstr(tmp+1,"/")+1);
					//printf("Executando %s\n",cmdbuff);
					sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
					//printf("Resultado DEL: %s\n",buffer); 
					char *c=strstr(buffer,"Deleted user"); 
					int idx=0;
					while(c!=NULL) {
						idx++;
						c=strstr((c+12),"Deleted user");
					}
					if (idx==numusers) sprintf(buffer,"OK: %d Usuarios Borrados",numusers);
					else					 sprintf(buffer,"ERROR: Se Eliminaron %d Usuarios de %d",idx,numusers);
					remove(tmp);
				} else strcpy(buffer,"ERROR: Imposible crear o ficheiro temporal");
				send(skd,buffer,strlen(buffer),0);				
			}
			else if (strncmp(buffer,"SETQUOTAS:",10)==0) {
				char *b=trim(strstr(buffer,":")+1);
				char *msg="ERROR: Imposible poñer as cuotas";
				char cmdbuff[128];
				char bufline[512];
				char *tmp=tmpnam (NULL); 
				int idx;

				FILE *fp=fopen(tmp,"wb+");
				if (fp!=NULL) {
					char *line=strtok(b,"#"); idx=0;
					while(line!=NULL) {
						snprintf(bufline,512,"setquota -u %s\n",line);
						char *ptr=bufline; 
						while(*ptr) {
							if (*ptr==',') *ptr=' ';
							ptr++;
						}
						fwrite(bufline,strlen(bufline),1,fp);
						line=strtok(NULL,"#"); idx++;
					}
					fclose(fp);
					sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
					snprintf(cmdbuff,sizeof(cmdbuff),"bash .tmpadp/%s 2>&1 && rm -Rf .tmpadp",strstr(tmp+1,"/")+1);
					sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
					if (buffer[0]==0) {
						sprintf(buffer,"OK: Cuotas postas a %d usuarios",idx);
						msg=buffer;
					}
					else {
						snprintf(cmdbuff,sizeof(cmdbuff),"ERROR: %s",buffer);
						msg=cmdbuff;
					}
					remove(tmp);
				} else msg="ERROR: Imposible crear comandos";
				send(skd,msg,strlen(msg),0);
			}
			else if (strncmp(buffer,"ADDUSERS:",9)==0) { 
				char *b=trim(strstr(buffer,":")+1);
				createUsers(skd,b,secpass);
			} else if (strncmp(buffer,"SETENABLE:",10)==0) {
				char *b=trim(strstr(buffer,":")+1);
				char *msg="ERROR: Imposible cambiar o estado";
				char cmdbuff[128];
				char bufline[512];
				char *tmp=tmpnam (NULL); 
				int idx;

				FILE *fp=fopen(tmp,"wb+");
				if (fp!=NULL) {
					char *line=strtok(b,","); idx=0;
					while(line!=NULL) {
						snprintf(bufline,512,"samba-tool user %s\n",line);
						char *ptr=bufline; 
						while(*ptr) {
							if (*ptr==',') *ptr=' ';
							ptr++;
						}
						fwrite(bufline,strlen(bufline),1,fp);
						line=strtok(NULL,","); idx++;
					}
					fclose(fp);
					sshCopy(HOST,secpass,tmp,"/.tmpadp"); 
					snprintf(cmdbuff,sizeof(cmdbuff),"bash .tmpadp/%s 2>&1 && rm -Rf .tmpadp",strstr(tmp+1,"/")+1);
					sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
					if (buffer[0]==0) {
						sprintf(buffer,"OK: Desactivados %d usuarios",idx);
						msg=buffer;
					}
					else {
						int c=0; line=strstr(buffer,"Enabled"); while (line!=NULL) { line+=7; c++; line=strstr(line,"Enabled");  }
						if (c==idx) snprintf(cmdbuff,sizeof(cmdbuff),"OK: Activados %d usuarios",c);
						else if (c>0) snprintf(cmdbuff,sizeof(cmdbuff),"ERROR: Activados %d usuarios de %d",c,idx);
						else	snprintf(cmdbuff,sizeof(cmdbuff),"ERROR: %s",buffer);
						msg=cmdbuff;
					}
					remove(tmp);
				} else msg="ERROR: Imposible crear comandos";
				send(skd,msg,strlen(msg),0);
         } else if (strncmp(buffer,"GETOUS:",7)==0) {
				char oubuf[1024];

				//ou=Alumnos...
				char *b=trim(strstr(buffer,":")+1);
				strncpy(oubuf,b,sizeof(oubuf));
				snprintf(cmdbuff,sizeof(cmdbuff),_command_ous,oubuf); 
				//printf("Consultando %s\n",cmdbuff);
				sshCommand(HOST,cmdbuff,secpass,buffer,sizeof(buffer));
				memset(cmdbuff,0,sizeof(cmdbuff)); 
				snprintf(cmdbuff,sizeof(cmdbuff),_command_groups,oubuf); 
				//printf("Calling (%s) %s\nSSHing...\n\n",oubuf,cmdbuff);
				sshCommand(HOST,cmdbuff,secpass,buffer1,sizeof(buffer1)); 
				ousToXML(buffer,buffer1,buffxml,sizeof(buffxml));
				send(skd,buffxml,strlen(buffxml),0); 
			} else if (strstr(buffer,"MOVEUSERS")!=NULL) {
				char *msg=moveUsers(secpass,buffer,sizeof(buffer));
				//printf("--->RESULT: *%s*\n",msg);
				send(skd,msg,strlen(msg),0);	
			}
      } else break;
   } while (1);
   close_s_cypher();
   close(skd);
}

void end(int signal) {
	wait(NULL);
}
 
void proceso(int port)
{
   int sk;
   struct sockaddr_in addr;
   struct hostent *he;
   int skd;
   int kk;
	int fl;

   signal(SIGCHLD, end); 
   sk=socket(PF_INET,SOCK_STREAM,0);
   if (sk!=-1) {
      addr.sin_family=AF_INET;
      addr.sin_port=htons(port);
      addr.sin_addr.s_addr=inet_addr(IP);
      if (bind(sk,(struct sockaddr *)&addr,sizeof(addr))!=-1) {
         if (listen(sk,5)!=-1) {
            while(1) {
               kk=sizeof(addr);
               skd=accept(sk,(struct sockaddr *)&addr,&kk);
               if (skd!=-1) {
                  switch(fork()) {
                     case 0: close(sk);
									  fl=open("/tmp/lck.lck",O_WRONLY,S_IWRITE);
									  flock(fl,LOCK_EX);
                             atende(skd,&addr);
									  flock(fl,LOCK_UN);
									  close(fl);
			     exit(EXIT_SUCCESS);
                             break;
                     case -1:  
                     default:  close(skd);
                               break;
                  }
               }
            }
         }
      }
      close(sk);
   }
}

void main(int argc,char *argv[]) {

  pid_t pid, sid;
  if ((pid=fork())==-1)  {
         exit(EXIT_FAILURE); 	 
  }
  if (pid!=0) exit(EXIT_SUCCESS);
  umask(0);
  sid = setsid();
  if (sid < 0) {
	printf("Error setsid %s\n",strerror(errno));
  	exit(EXIT_FAILURE);
  }
  
  if ((chdir(WORK)) < 0) {
	printf("Error chdir %s\n",strerror(errno));
        exit(EXIT_FAILURE);
  }
  close(STDIN_FILENO);
  close(STDOUT_FILENO);
  close(STDERR_FILENO);
  proceso(PORT);	
  exit(EXIT_SUCCESS);		    
}
