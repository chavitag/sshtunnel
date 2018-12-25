#include <string.h>
#include "base64.h"

static const char  _table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
static const int   BASE64_INPUT_SIZE = 57;

#define BOOL unsigned char

BOOL isbase64(char c) {
   return c && strchr(_table, c) != NULL;
}

static inline char value(char c)  {
   const char *p = strchr(_table, c);
   if(p)    return p-_table;
   else     return 0;
}

int unBase64(unsigned char *dest, int destlen, const unsigned char *src, int srclen) {
   unsigned char *p = dest;

   *dest = 0;
   if(*src == 0) return 0;
   do {
      char a = value(src[0]);
      char b = value(src[1]);
      char c = value(src[2]);
      char d = value(src[3]);
	   if (((p+4)-dest)>=destlen) break;
      *p++ = (a << 2) | (b >> 4);
      *p++ = (b << 4) | (c >> 2);
      *p++ = (c << 6) | d;
      if(!isbase64(src[1])) {
         p -= 2;
         break;
      } 
      else if(!isbase64(src[2])) {
         p -= 2;
         break;
      } 
      else if(!isbase64(src[3])) {
         p--;
         break;
      }
      src += 4;
      while(*src && (*src == 13 || *src == 10)) src++;
   } while(srclen-= 4);
   *p = 0;
   return p-dest;
}

