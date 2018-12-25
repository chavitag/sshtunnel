/**
 * section: Parsing
 * synopsis: Parse an XML document in memory to a tree and free it
 * purpose: Demonstrate the use of xmlReadMemory() to read an XML file
 *          into a tree and and xmlFreeDoc() to free the resulting tree
 * usage: parse3
 * test: parse3
 * author: Daniel Veillard
 * copy: see Copyright for the status of this software.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "trim.h"
#include "xmlutil.h"

/*
 *To compile this file using gcc you can type
 *gcc `xml2-config --cflags --libs` -o xmlexample libxml2-example.c
 */

/**
 * parseXML:
 * @content: the content of the document
 * @length: the length in bytes
 * @base: Base per RFC 2396
 *
 * Parse the in memory document and returns the resulting tree
 */
xmlDocPtr
parseXML(const char *content, int length,char *base) {
    xmlDocPtr doc; /* the resulting document tree */

    /*
     * this initialize the library and check potential ABI mismatches
     * between the version it was compiled for and the actual shared
     * library used.
     */
	 xmlInitParser();
	 LIBXML_TEST_VERSION
    doc = xmlReadMemory(content, length, base, NULL, 0);
    return doc;
}

void closeXML(xmlDocPtr xml) {
	xmlFreeDoc(xml);
	xmlCleanupParser();
}

char **
execXPath (xmlDocPtr doc, xmlChar *xpath){
	char **nodes=NULL;
	xmlXPathContextPtr context;
	xmlXPathObjectPtr result;
	xmlNodeSetPtr nodeset;
	int i;
	xmlChar *keyword;
	char *txt;

	context = xmlXPathNewContext(doc);
	if (context == NULL) return NULL;

	result = xmlXPathEvalExpression(BAD_CAST xpath, context); 
	xmlXPathFreeContext(context);
	if (result == NULL) return NULL;
	if(xmlXPathNodeSetIsEmpty(result->nodesetval)) {
		xmlXPathFreeObject(result);
		return NULL;
	}
	if (result) { 
		nodeset = result->nodesetval; //printf("Resultados Scanning....\n");
		nodes=calloc(nodeset->nodeNr+1,sizeof(char *)); 
		if (nodes!=NULL) { 
			for (i=0; i < nodeset->nodeNr; i++) {
				keyword = xmlNodeListGetString(doc, nodeset->nodeTab[i]->xmlChildrenNode, 1);
				if (keyword!=NULL) { 
					char *txt=trim(keyword); 
					nodes[i]=calloc(strlen(txt)+1,sizeof(char));
					if (nodes[i]!=NULL) strcpy(nodes[i],txt);
					else 	{
						//printf("Imposible reservar memoria para %s\n",txt);
						freeXPath(nodes);
						return NULL;
					}
					xmlFree(keyword);
				} else nodes[i]=NULL;
			}
			//printf("Procesados %d\n",i);
			xmlXPathFreeObject (result);
		}
	}
	return nodes;
}


void freeXPath(char **nodes) {
	int idx=0;
	if (nodes!=NULL) {
		while(nodes[idx]) free(nodes[idx++]);
		free(nodes);
	}
}

/*
int main(int argc, char **argv) {
	FILE *fp;
	char buffer[65535];
	int len;
	xmlDocPtr xml;

	fp=fopen(argv[1],"rb");
	fseek(fp,0L,SEEK_END); len=ftell(fp); fseek(fp,0L,SEEK_SET);
	fread(buffer,len,1,fp);
	fclose(fp);
	buffer[len]=0;
	xml=parseXML(buffer,strlen(buffer),"test.xml");
	if (xml!=NULL) { 
		char **info=execXPath(xml,argv[2]); printNodes(info);
		freeXPath(info);
		closeXML(xml);
	}
}*/


