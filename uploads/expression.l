%{
#include "expression.tab.h"
%}

%%
[0-9]+ { yylval = atoi(yytext); return NUM; }
.|\n  { return yytext[0]; }
%%

int yywrap() {
    return 1;
}

