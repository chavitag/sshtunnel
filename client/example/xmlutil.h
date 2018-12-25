#ifndef __XMLUTILH__
#define __XMLUTILH__
#include <libxml/parser.h>
#include <libxml/tree.h>
#include <libxml/xpath.h>
#include <libxml/xpathInternals.h>

xmlDocPtr parseXML(const char *content, int length,char *base);
void freeXPath(char **nodes);
void closeXML(xmlDocPtr xml);
char **execXPath (xmlDocPtr doc, xmlChar *xpath);


#endif
