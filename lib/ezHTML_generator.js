/*****
1. * => ul li   
2. ---xxx   => a name  nav target_box
3. %code[js]% %code[c]%  -> code
 
5. %# 一般文字
6. !  answer
7. %html% %htmlEnd%  output html
8. %T title
9. %img[url,width,height]alt%
10. %pop[url,width,height]text%
11. %Q quatation

var ezHTML = ezHTML_generator();
ezHTML.transform(html);
******/
(function() {

/**
 consturctor
*/	
function ezHTML_generator() {

}


var o = ezHTML_generator.prototype;

/*******
Properties
*******/
//mainDomain: If domain of link is different with mainDomain, anchor will auto add target to be "_blank".
o.mainDomain='www.defult.com';

o.nowtag = Array();
o.i = 0;

//html_target is the all h2 tag, use this infomation to show catalog
o.html_target = Array();
o.html = Array();



/*********
Methods
**********/
o.loadGoogleCodePretty=function(baseUrl){
    var sources = [
      "prettify.js",
      "lang-css.js",
      "lang-go.js",
      "lang-hs.js",
      "lang-lisp.js",
      "lang-lua.js",
      "lang-ml.js",
      "lang-proto.js",
      "lang-scala.js",
      "lang-sql.js",
      "lang-wiki.js",
      "lang-vhdl.js",
      "lang-vb.js",
      "lang-yaml.js",
      "lang-proto.js",
      "lang-php.js",
      "lang-sh_my.js",
      "lang-js_my.js",
      "lang-linux.js"
  ];
  var styles = [
      "prettify.css"
  ];
  for (var i = 0; i < sources.length; ++i) {
    var head=document.getElementsByTagName('head');
    var d=document.createElement('script');
    d.src=baseUrl + sources[i]
    head[0].appendChild(d);
  }
};

o.transform = function(data) {/*{{{*/
    var i, n, lines, html, html2, sections, matches;
    var textIndex, textLen; 
    html = [];
//    this.i = 0;
//    this.html = Array();
//    this.html_target = Array();
    sections = this.getArticleSection(data);
    
    var n = sections.length;
    for (i = 0; i < n; i++) {
        if (!sections[i].title) { continue;}
//console.log(sections[i].text);
        html2 = this.transformSection(sections[i].text);
        html = html.concat(html2);
/*        textIndex = 0;
        textLen = 
        matches = sections[i][0].match(/([a-z]+)---/);
        if(matches){
            switch(matches[1]){
                case 'left':
                    this.html.push('<div class="clear">'+"\n");
                    this.html.push('<div class="vj-float-left">'+"\n");
                    break;
                case 'right':
                    this.html.push('<div class="vj-float-right">'+"\n");
                    break;
            }
        }*/
/*        this.transformStart(sections[i]);
        if(matches){
            switch(matches[1]){
                case 'left':
                    this.html.push('</div>'+"\n");
                    break;
                case 'right':
                    this.html.push('</div><div class="clear"></div></div>'+"\n");
                    break;
            }
        }*/
    }
    
//    var html = this.getHTML();
    return html.join("\n");
};/*}}}*/



o.getHTML=function(){/*{{{*/
    var n=this.html.length;
    var html_target=this.getHTMLTarget();
    var html='<a name="top"></a>';
    
    for(var i=0; i<n ; i++){
        try{
            if( typeof(this.html[i])=='string' && this.html[i].match(/%TOC%/)){
                html+=html_target;
            }
            else{
                html+=this.html[i];
            }
        }
        catch(e){
            console.log(e);
        }
    }
    return html;
}/*}}}*/

//output nav anchor
o.getHTMLTarget=function(){/*{{{*/
    var tar=this.html_target;
    var n=tar.length;
    var html='<div class="target_box">'+"\n"+'<ul>'+"\n",t,style;
    for(var i=0; i<n;i++){
        style="";
        if(tar[i].level>0){
            style='class="vj-lv'+tar[i].level+'"';
        }

        
        t='<li '+style+'><a href="#vj-t'+i+'">'+tar[i].value+'</a></li>';
        html+=t+"\n";
        
    }
    html+='</ul>'+"\n"+'</div>';
    return html;
};/*}}}*/

/*
 * Split article section  
 * I split the whole text into multi secitons.
 * @return [{title:"", text:"plain text"}]
**/
o.getArticleSection = function(data) {/*{{{*/
    var i, n, tag, data, lines, line, matches, sections, sectionsLen, REG_H2;

    lines = data.split(/[\r\n]/);
    n = lines.length
    i = 0;
    REG_H2 = /^([\s]*)(#h2|##)[\s]+([^\n\r]+)/i;
    sections = Array();
    sectionsLen = 0;
    for (i ; i<n ; i++) {
        line = lines[i];
        matches = line.match(REG_H2);
        if (!matches) {
            sections[sectionsLen - 1]['text'].push(line);
        } else {
            sections[sectionsLen] = {
                title: this.trim(matches[3]),
                text: [line]
            };
            sectionsLen++;
        }
    }
    
    return sections;
};/*}}}*/

o.transformSection = function(lines) {/*{{{*/
    var n = lines.length, tag, html;
    html = [];
    this.i = 0;
    for (this.i ; this.i < n ; ) {
        tag = this.checkTag(lines[this.i]);
        switch(tag) {
            case 'ul':
                html = html.concat(this.transformUl(lines));
                break;
            case 'h':
                html = html.concat(this.transformHeader(lines[this.i]));
                this.i++
                break;
            case 'normalTag':
                html = html.concat(this.transformNormalTag(lines[this.i]));
                this.i++
                break;
            case 'code':
                data=this.transformCode(lines);
                
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            case 'html': //html原始碼
                data=this.transformHTML(lines);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            case 'comment'://remove
                html = html.concat(this.transformComment(lines[this.i]));
                this.i++
                break;
            case 'amazing2'://remove
                data = this.transformAmazing2(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;

            case 'amazing':
                data=this.transformAmazing(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            case 'pop':
                data=this.setPop(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            case 'Title':
                data=this.setTitle(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            case 'Quote':
                data = this.setQuote(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;

            case 'image':
                data=this.setImage(lines[this.i]);
                if(data)
                    this.html.push(data+"\n");
                this.i++
                break;
            default:
                if (lines[this.i].match(/<[^>]+>/)) {
                    html.push(this.transformContent(lines[this.i]));
                } else {
                    if (lines[this.i] != "") {
                        html.push(this.transformContent(lines[this.i])+"<br />");
                    }
                }
                this.i++
                break;
        }
    }
    return html; 
};/*}}}*/

o.transformHeader = function (line) {
    var REG, REG_H, matches, html, classText, tagName, content;
    classText = "";
    REG = /^([\s]*)([#]+)[\s]+([^\n\r]+)/i;
    REG_H = /^([\s]*)#(h[0-9])[\s]+([^\n\r]+)/i;
    matches = line.match(REG);
    if (matches) {
        switch(matches[2]) {
            case '#':
                tagName = "h1";
                break;
            case '##':
                tagName = "h2";
                break;
            case '###':
                tagName = "h3";
                break;
        }
        content = matches[3];
    } else if (matches = line.match(REG_H)) {
        content = matches[3];
        tagName = matches[2];
    }
    content = this.trim(content);
    if (!content) return [];
    html = "<" + tagName + "%s>%s</" + tagName + ">";
    html = this.sprintf(html, classText, content);

    return [html];
};

//div span ...
o.transformNormalTag = function (line) {
    var REG, matches, html, classText, tagName, content, attributes;
    attributes = "";
    REG = /^([\s]*)#([a-z]+)(\[[^\]]+\])?[\s]*([^\n\r]+)/i;
    matches = line.match(REG);

    if (matches) {
        tagName = matches[2];
        content = matches[4];
        attrData = matches[3];
        attributes = this.getAttributes(attrData);
    } else {
        return [];
    }

    content = this.trim(content);
    if (!content) return [];
    html = "<" + tagName + "%s>%s</" + tagName + ">";
    html = this.sprintf(html, attributes, content);

    return [html];
};

//判定下一個HTML tag是什麼
o.checkTag = function(line) {/*{{{*/
    var mat, reg;
    reg = /^([\s]*)*\*[\s][\S]/; //ul
    mat = line.match(reg);
    if(mat) {return 'ul';}



    //check start string is #  or passed.
    var re_t=/(?:^([\s]*)!|#)/;
    mat=line.match(re_t);
    if(!mat){
        
        return "";
    }

    //h1 ~ 3 
    reg = /^([\s]*)([#]+)[\s]+([^\n\r]+)/i;
    mat = line.match(reg);
    if(mat) {return 'h';}

    //h1 ~ 6
    reg = /^([\s]*)(#h[0-9])[\s]+([^\n\r]+)/i;
    mat = line.match(reg);
    if(mat) {return 'h';}

    //normal tag: div span ...
    reg = /^([\s]*)#([a-z]+)/i; //code
    mat = line.match(reg);
    if(mat) {return 'normalTag';}

//    //![class] 
//    var re_t = /(?:^([\s]*)!\[[^\]]+\])/i;
//    mat = line.match(re_t);
//    if (mat) {
//        return 'amazing2';
//    }
//
    var re_code=/%code\[([^\]]+)\][^\]]*%/; //code
    mat=line.match(re_code);
    if(mat){return 'code';}
    
    //comment  %#
    var re_code=/%#[\s][\S]/; //code
    mat=line.match(re_code);
    if(mat){return 'comment';}
    
    //ans  !
    reg = /^([\s]*)![\s][\S]/; //amazon
    mat = line.match(reg);
    if(mat){return 'amazing';}
    
    
    
    
    //ans  !
    var re_code=/%html%/; //code
    mat=line.match(re_code);
    if(mat){return 'html';}
    
    //pop  !
    var re_code=/%pop\[[^\]]+\].*%/; //code
    mat=line.match(re_code);
    if(mat){return 'pop';}
    
    //title
    var re_code=/^%T /; //code
    mat=line.match(re_code);
    if(mat){return 'Title';}

    //quatation
    var re_code=/^([\s]*)%Q /; //code
    mat=line.match(re_code);
    if(mat){return 'Quote';}

    var re_code=/%img\[/i; //img
    mat=line.match(re_code);
    if(mat){return 'image';}
};/*}}}*/

// h1 h2 title
o.setTarget=function(line){/*{{{*/
    var re_target=/^([\s]*)%---([^\n\r]*)/i; //target 暫存在這，拱後面輸出 TOC
    
    var k=line.match(re_target),len;
    if(!k[1]){len=0;}
    else{len=k[1].split(/\s/); len=len.length/4;}
    var hn=this.html_target.length;
    
    var mat2=k[2].match(/[a-z]+---([^\n\r]+)/);
    if(mat2){k[2]=mat2[1];}
    else{
        this.html_target.push({"level":len,"value":k[2]});
    }
    var class2="",t="",b="",tag="";
    
    if(len>0 ){ 
        class2=' vj-lv'+len;
        
        //第二層以後的menu不加top			
    }
    else{
        b='<a href="#top" class="vj-btn_top2"></a>';
        
    }
    tag="h"+( Math.floor(len/3)+2);
    t='<a name="vj-t'+hn+'"></a>';
    this.html.push(t+'<'+tag+' class="vj-sub-title'+class2+'">'+k[2]+'</'+tag+'>'+b+"\n");

}/*}}}*/

/*
 *   [tab]*[class] list1
*/
o.transformUl = function(lines) {/*{{{*/
    var REG, line, html, matches, classText, liIndent, liIndent2, data, content, codeIndent = "", baseIndent;
    var REG = /^([\s]*)\*([\s][^\n\r]+)/;

    data = '<li%s>%s</li>';
    classText = "";
    html = [];
    line = lines[this.i];
    matches = line.match(REG);

    if (matches && matches[1]) {
        liIndent = this.spaceToIndentLength(matches[1]);
        codeIndent = matches[1];
    } else {
        liIndent = 0;
    }

    baseIndent = this.space(2);

    if (liIndent > 0 ) {
        classText = ' class="indent' + liIndent + '"';
    }

    
    html.push(codeIndent + '<ul class="list">');
    while (line && (matches = line.match(REG)) ) {
        if (matches && matches[1]) {
            liIndent2 = this.spaceToIndentLength(matches[1]);
        } else {
            liIndent2 = 0;
        }		
        
        if (liIndent2 > liIndent) {
            html = html.concat(this.transformUl(lines));
            line = lines[this.i];
            continue;
        } else if (liIndent2 < liIndent) {
            break;
        }


        content = this.trim(matches[2]);
        content = this.transformContent(content);
        content = codeIndent + baseIndent + this.sprintf(data, classText, content);
        
        html.push(content);
        this.i++;
        line = lines[this.i];
    }

    html.push(codeIndent + '</ul>');
    return html
};/*}}}*/

/**
1. link: http https
**/
o.transformContent = function(line) {/*{{{*/
    var link;
    var re_http=/[\s]http[s]?:\/\/([^\/]+)[^\s]+(?!['"])/;
    var k=line.match(re_http);
    if (k && k[1]) {
        var tar = "";
        re_http = /http[s]?:\/\/([^\/]+)[^\s'"]+/;
        if (k[1] != this.mainDomain) {
            tar=' target="_blank"';
        }
        link = this.trim(k[0]);
        line = line.replace(re_http,'<a href="' + link + '" '+tar+'>'+ link +'</a>');
        
    }
    var re_strip=/([\\]+)/g;
    line=line.replace(re_strip,'&#92;');
    return line;
};/*}}}*/

/****use google code pretty**/
o.transformCode=function(lines){/*{{{*/
    var re_code=/%code\[([^\]]+)\]([^\]]*)%/; //code
    var re_codeend=/%codeEnd%/; //code
    var mat=lines[this.i].match(re_code),line;
    var data="";
    this.i++
    var n=lines.length;
    var codelineNum=0;
    if(mat && mat[1]){
        //get all data
        while(this.i<n){
            line=lines[this.i];
            if(!line.match(re_codeend)){
                line=line.replace(/\t/g,'   ');
                
                data+=line+'\n';
                codelineNum++;
            }
            else{
                var title="Example";
                if(mat[2]){
                    title = mat[2];
                }
                
                var d="<div class=\"codeBlock\"><span class=\"title\">"+title+"</span>";
                d+=this.googleCodePretty(data,mat[1],codelineNum);
                d+='</div>';
                return d;
             
            }
            this.i++
        }
    }
    return "";
};/*}}}*/

/****純 HTML code**/
o.transformHTML=function(lines){/*{{{*/
    var re_code=/%html%/; //code
    var re_codeend=/%htmlEnd%/; //code
    var mat=lines[this.i].match(re_code),line;
    var data="";
    this.i++
    var n=lines.length;
    var codelineNum=0;
    var html="";
    if(mat){
        //get all data
        while(this.i<n){
            line=lines[this.i];
            if(!line.match(re_codeend)){
                //line=line.replace(/\t/g,'   ');
                html+=line+"\n";
            }
            else{
                return  html;
             
            }
            this.i++
        }
    }
    return html;
};/*}}}*/


/*****comment 註解**/
o.transformComment=function(data){/*{{{*/
    var re=/^([\s]*)%#[\s](.+)/;
    var mat=data.match(re);
    var text="", class2 = "";
    if(!mat ||  !mat[1]){len=0;}
    else{len=mat[1].split(/\s/); len=len.length;}
    var style="";
    if (len > 3) {// style='style="margin-left:'+(this.leftWidth*len)+'px"'; 
        class2 = " vj-lv" + parseInt(((len/3)-1));
    }
    if(mat && mat[2]){
        mat[2]=this.transformContent(mat[2]);
        text='<p class="vj-quote' + class2 + '" >'+mat[2]+'</p>'+"\n";
    }
    
    return text;
}/*}}}*/

/*****amazing**/
o.transformAmazing=function(data){/*{{{*/
    var re=/^([\s]*)![\s](.+)/;
    var mat=data.match(re);
    var text="";
    if(!mat ||  !mat[1]){len=0;}
    else{len=mat[1].split(/\s/); len=len.length;}
    var class2="";
    if(len>0){ 
        class2=' vj-lv'+Math.ceil(len/3); 
    }
    if(mat && mat[2]){
        mat[2]=this.transformContent(mat[2]);
        text='<p class="vj-amazing'+class2+'">'+mat[2]+'</p>'+"\n";
    }
    
    return text;
}/*}}}*/

/*****amazing2**/
o.transformAmazing2 = function(data){/*{{{*/
    var re=/^([\s]*)!\[([^\]]+)\](.*)/;
    var mat=data.match(re);
    var text="";
    if (!mat ||  !mat[1]) {
        len=0;
    } else {
        len=mat[1].split(/\s/); len=len.length;
    }
    var class2="";
    if(len>0){ 
        class2=' vj-lv'+Math.ceil(len/3); 
    }
    if (mat && mat[2]) {
        mat[2] = this.transformContent(mat[2]);
        text='<div class="vj-example'+class2+'">'+mat[2]+'</div>'+"\n";
    }
    
    return text;
}/*}}}*/

/*****pop out**/
o.setPop=function(data){
    var re=/%pop\[([^\]]+)\](.*)%/;
    var mat=data.match(re);
    var w=0,h=0;
    var s=mat[1].split(/,/);
    if(s[1]){w=s[1];}
    if(s[2]){h=s[2];}
    var url=s[0];
    var text='<a href="#" onclick="popup(\''+url+'\',event,'+w+','+h+');return false;">'+mat[2]+'</a>'+"\n";
    
    return text;
}

/*****title **/
o.setTitle=function(data){/*{{{*/
    var re=/^%T (.+)/;
    var mat=data.match(re);
    if(!mat){
        return "";
    }
    var text='<h1 class="vj-title">'+mat[1]+'</h1>'+"\n";
    
    return text;
};/*}}}*/

/*****Quotation **/
o.setQuote = function(data){/*{{{*/
    var re = /^([\s]*)%Q (.+)/;
    var mat = data.match(re),
        text;
    if(!mat ||  !mat[1]) {
        len=0;
    } else{
        len = mat[1].split(/\s/); 
        len = len.length;
    }
    var style="";
    if(len > 0){
//        style='style="margin-left:'+(this.leftWidth*len)+'px"'; 
    }

    if(mat && mat[2]){
        mat[2] = this.transformContent(mat[2]);

        text = '<blockquote class="vj-blockquote" ' + style + '>'+mat[2]+'</blockquote>'+"\n";
    }

    
    return text;
};/*}}}*/

/*****image **/
o.setImage=function(data){/*{{{*/
    var re=/%img\[([^\]]+)\]([^%]+)%/;
    var mat=data.match(re);
    if(!mat){
        return "";
    }
    
    var img=mat[1].split(/,/);
    var width="";
    if(img[1] && img[1]>0){
        width='width="'+img[1]+'"';
    }
    var text='<div ><a href="' + img[0] + '" target="_blank"><img src="'+img[0]+'" alt="'+mat[2]+'" onmouseover="return imageBig(this);" onmouseout="return imageSmall(this);"  class="vj-image" '+width+'/></a></div>'+"\n";

    return text;
};/*}}}*/

o.googleCodePretty=function(data,type,codelineNum){
    var cls = "prettyprint";
    type = 'lang-'+type;
    cls+=" "+type;
    cls+=" linenums";
    //data=data.replace(/#/g,"");
    data=data.replace(/</g,"&lt;");
    var gcode=document.createElement('div');
    gcode.id="google-pretty-code";
    
    var pre=document.createElement('pre');
    pre.id="google-pretty";
    pre.innerHTML=data;
    pre.className=cls;
    document.body.appendChild(pre);
    prettyPrint();
    
    var s=document.getElementById('google-pretty').innerHTML;
    s=s.replace(/\\/g,'&#92;');
    var p=document.getElementById('google-pretty');
    p.parentNode.removeChild(p);
    var style="";
    if(codelineNum>15){
//			style='style="height:280px;overflow:auto;"';
    }
    return "\n"+'<pre class="'+cls+'" '+style+'>'+s+'</pre>'+"\n";
};

//output  class="xxx" lang="xxx"
o.getAttributes = function (data) {//{{{
    var attr = "", REG, REG2, REG_CLASS, matches, match, i, n;
    if (!data) return "";
    REG = /([\w]+)=([\w\-]+)/ig;
    REG2 = /([\w]+)=([\w\-]+)/i;
    REG_CLASS = /([\w\-]+)[^=]/i;

    matches = data.match(REG);
    n = matches.length;
    for (i = 0; i < n; i++) {
        match = matches[i].match(REG2);
        attr += ' ' + this.trim(match[1]) + '="' + this.trim(match[2]) + '"';
    }
    match = data.match(REG_CLASS);
    if (match) {
        attr += ' class="' + this.trim(match[1]) + '"';
    }
    return attr;
};//}}}

/***********
 Core Library
***********/
o.spaceToIndentLength = function (space) {
    var len;
    len = space.split(/\s/).length;
    return Math.floor(len/2);
};

o.space = function (len) {
    var html = "", i;
    for (i = 0; i < len; i++) {
        html += " ";
    }
    return html;
};

o.trim = function (data) {
    if (!data) return "";
    return data.replace(/^[\s]+/, '').replace(/[\s]+$/, '');
};

o.sprintf = function(str) {
    var newStr = str, i = 1;
    while (/%s/.test(newStr))
        newStr = newStr.replace("%s", arguments[i++])

    return newStr;
};



if (typeof(window) != "undefined") {
    window['ezHTML_generator'] = ezHTML_generator;
}

if (typeof(module) != "undefined") {
    module.exports = ezHTML_generator;
}

}());


