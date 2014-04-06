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
      "lang-php.js"
     // "lang-sh_my.js",
     // "lang-js_my.js",
     // "lang-linux.js"
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
//    this.html = Array();
//    this.html_target = Array();
    sections = this.getArticleSection(data);
    
    var n = sections.length;
    for (i = 0; i < n; i++) {
        if (!sections[i].title) { continue;}
        html2 = this.transformSection(sections[i].text);
        html = html.concat(html2);
    }
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
 * @return [{title:"paragraph 1", text:"plain text"}, {}]
**/
o.getArticleSection = function(data) {/*{{{*/
    var i, n, tag, data, lines, line, matches, sections, sectionsLen, REG_H2;

    lines = data.split(/[\r\n]/);
    n = lines.length
    i = 0;
    REG_H2 = /^([\s]*)(#h2|##)[\s]+([^\n\r]+)/i;
    sections = [];
    sectionsLen = 0;
    sections[0] = {
        title: "Beginning",
        text: []
    };
    for (i ; i<n ; i++) {
        line = lines[i];
        matches = line.match(REG_H2);
        if (!matches) {
            if (sections[sectionsLen]) {
                sections[sectionsLen]['text'].push(line);
            }
        } else {
            sectionsLen++;
            sections[sectionsLen] = {
                title: this.trim(matches[3]),
                text: [line]
            };
        }
    }
    return sections;
};/*}}}*/

o.transformSection = function(lines) {/*{{{*/
    var n = lines.length, tag, html;
    html = [];
    var obj = {i: 0};

    for (obj.i = 0 ; obj.i < n ;) {
        tag = this.checkTag(lines[obj.i]);
        switch(tag) {
            case 'ul':
                html = html.concat(this.transformUl(lines, obj));
                break;
            case 'h':
                html = html.concat(this.transformHeader(lines[obj.i]));
                obj.i++
                break;
            case 'normalTag':
                html = html.concat(this.transformNormalTag(lines[obj.i]));
                obj.i++
                break;
            case 'code':
                data = this.transformCode(lines, obj);
                html.push(data);
                obj.i++
                break;
            case 'html': //html原始碼
                data = this.transformHTML(lines, obj);
                if(data) {
                    html = html.concat(data);
                }
                obj.i++
                break;
/*            case 'comment'://remove
                html = html.concat(this.transformComment(lines[obj.i]));
                obj.i++
                break;*/
            case 'amazing2'://remove
                data = this.transformAmazing2(lines[obj.i]);
                if(data)
                    this.html.push(data+"\n");
                obj.i++
                break;
            case 'table':
                data = this.transformTable(lines, obj);
                html = html.concat(data);

                break;

            case 'amazing':
                data=this.transformAmazing(lines[obj.i]);
                if(data)
                    this.html.push(data+"\n");
                obj.i++
                break;
            case 'pop':
                data=this.setPop(lines[obj.i]);
                if(data)
                    this.html.push(data+"\n");
                obj.i++
                break;
            case 'Title':
                data=this.setTitle(lines[obj.i]);
                if(data)
                    this.html.push(data+"\n");
                obj.i++
                break;
            case 'Quote':
                data = this.setQuote(lines[obj.i]);
                if(data)
                    this.html.push(data+"\n");
                obj.i++
                break;

            case 'image':
                data = this.transformImage(lines, obj);
                if (data) {
                    html = html.concat(data);
                }
                obj.i++;
                break;
            default:
                if (lines[obj.i].match(/<[^>]+>/)) {
                    html.push(this.transformContent(lines[obj.i]));
                } else {
                    if (lines[obj.i] != "") {
                        html.push(this.transformContent(lines[obj.i])+"<br />");
                    }
                }
                obj.i++
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

    if (matches) {
        indent = this.spaceToIndentLength(matches[1]);
        if (indent > 0) {
            classText = ' class="indent' + indent +  '"';
        }
    }

    content = this.trim(content);
    if (!content) return [];
    html = "<" + tagName + "%s>%s</" + tagName + ">";
    html = this.sprintf(html, classText, content);

    return [html];
};

//div span ...
o.transformNormalTag = function (line) {//{{{
    var REG, matches, html, classText, tagName, content, attributes, attr, indent = "";
    attributes = "";
    REG = /^([\s]*)#([a-z]+)(\[[^\]]+\])?[\s]*([^\n\r]+)/i;
    matches = line.match(REG);

    indent = this.spaceToIndentLength(matches[1]);

    if (matches) {
        tagName = matches[2];
        content = matches[4];
        attrData = matches[3];
        attributes = this.getAttributes(attrData, indent);

        attributes = this.attributesToString(attributes);
    } else {
        if (indent > 0) {
            attributes = ' class="indent' + indent +'"';
        }
        return [];
    }

    content = this.trim(content);
    if (!content) return [];
    switch (tagName) {
        case 'q':
            tagName = "quoteblock";
            break;
    }
    html = "<" + tagName + "%s>%s</" + tagName + ">";
    html = this.sprintf(html, attributes, content);

    return [html];
};//}}}

//Get the statement of current line 
o.checkTag = function(line) {/*{{{*/
    var mat, reg;

    //UL
    reg = /^([\s]*)*\*[\s][\S]/;
    mat = line.match(reg);
    if(mat) {return 'ul';}

    //Table
    reg = /\|[^\|]+\|[^\|]+\|[\s\n\r]*$/;
    mat = line.match(reg);
    if(mat) {
        return 'table';
    }


    //Check the line must be start from #, or we will pass this line.
    var re_t=/(?:^([\s]*)!|#)/;
    mat=line.match(re_t);
    if(!mat){
        
        return "";
    }

    var re_code=/#code\[([^\]]+)\][^\]]*#?/; //code
    mat=line.match(re_code);
    if(mat){return 'code';}

    //h1 ~ 3 
    reg = /^([\s]*)([#]+)[\s]+([^\n\r]+)/i;
    mat = line.match(reg);
    if(mat) {return 'h';}

    //h1 ~ 6
    reg = /^([\s]*)(#h[0-9])[\s]+([^\n\r]+)/i;
    mat = line.match(reg);
    if(mat) {return 'h';}

    reg = /#img/i; //img
    mat = line.match(reg);
    if (mat) {return 'image';}

    //html 
    reg = /^([\s]*)#html#/i;
    mat = line.match(reg);
    if(mat) {return 'html';}

    //normal tag: all html tag - div span ...
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
    
    
    //ans  !
    reg = /^([\s]*)![\s][\S]/; //amazon
    mat = line.match(reg);
    if(mat){return 'amazing';}
    
     
    //pop  !
    var re_code=/%pop\[[^\]]+\].*%/; 
    mat=line.match(re_code);
    if(mat){return 'pop';}
    
    //quatation
    var re_code=/^([\s]*)%Q /; 
    mat=line.match(re_code);
    if(mat){return 'Quote';}

};/*}}}*/


/*
 *   [tab]*[class] list1
*/
o.transformUl = function(lines, obj) {/*{{{*/
    var REG, line, html, matches, classText, liIndent, liIndent2, data, content, codeIndent = "", baseIndent;
    var REG = /^([\s]*)\*([\s][^\n\r]+)/;

    data = '<li%s>%s</li>';
    classText = "";
    html = [];

    line = lines[obj.i];
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
            html = html.concat(this.transformUl(lines, obj));
            line = lines[obj.i];
            continue;
        } else if (liIndent2 < liIndent) {
            break;
        }


        content = this.trim(matches[2]);
        content = this.transformContent(content);
        content = codeIndent + baseIndent + this.sprintf(data, classText, content);
        
        html.push(content);
        obj.i++;
        line = lines[obj.i];
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

o.transformTable = function(lines, obj) {/*{{{*/
    var link, tr, html = [], i, n, j;
    j = 0;
    html.push('<table class="table">');
    line = lines[obj.i];
    while (line && line.match(/[\s]*\|[^\|]+\|[^\|]+\|[\s\n\r]*$/)) {
        if (j > 190)  {obj.i++; break};
        j++;
        tr = line.split(/\|/);
        if (tr && tr[1]) {
            n = tr.length; 
            html.push("<tr>");
            for (i = 1; i < n - 1; i ++) {
                td = this.trim(tr[i]);
                td = this.transformContent(td);
                if (td.match(/^\*/)) {
                    html.push('<th>' + td.replace(/^\*/, '').replace(/\*$/, '') + '</th>');
                } else {
                    html.push('<td>' + td + '</td>');
                }
            }
            obj.i++;
            line = lines[obj.i];
            html.push('</tr>');
        } else {
            obj.i++;
            console.log("table have bug");
            break;
        }
    }
    html.push('</table>');
    return html;
};/*}}}*/

/****use google code pretty**/
o.transformCode = function(lines, obj) {/*{{{*/
    var type;
    var re_code = /^#code\[([^\]]+)\]([^\]#]*)#?/;
    var re_codeend=/#codeEnd#/;
    var mat = lines[obj.i].match(re_code), line;
    var data = "";
    obj.i++
    var n = lines.length;
    var codelineNum=0;
    if (mat && mat[1]) {
        type = mat[1];
        //get all data
        while (obj.i < n) {
            line = lines[obj.i];
            if (!line.match(re_codeend)) {
                line = line.replace(/\t/g,'   '); 
                data += line+'\n';
                codelineNum++;
            } else {
                var title = "Example";
                if (mat[2]) {
                    title = mat[2];
                }
                
                var d="<div class=\"codeBlock\"><span class=\"title\">"+title+"</span>";
                d += this.googleCodePretty(data, type, codelineNum);
                d += '</div>';
                return d;
             
            }
            obj.i++
        }
    }
    return "";
};/*}}}*/

/****純 HTML code**/
o.transformHTML = function(lines, obj) {/*{{{*/
    var re_code=/#html#/; //code
    var re_codeend=/#htmlEnd#/; //code
    var mat=lines[obj.i].match(re_code),line;
    var data="";
    obj.i++
    var n=lines.length;
    var codelineNum=0;
    var html="";
    if(mat){
        //get all data
        while (obj.i<n) {
            line=lines[obj.i];
            if(!line.match(re_codeend)){
                //line=line.replace(/\t/g,'   ');
                html += line+"\n";
            }
            else{
                return  html;
             
            }
            obj.i++
        }
    }
    return html;
};/*}}}*/


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


/*****image **/
o.transformImage = function(lines, obj) {/*{{{*/
    var i, n, line, REG, mat, url, attrsData, style, attributes, attr = "", divStyle, html, content, className, REG_End, imgBlock, a, img, indent;
    img = "";
    REG = /^([\s]*)#img[\s]([^#]+)#?/;
    REG_End = /[\s]*#imgEnd#/;
    line = lines[obj.i];
    mat = line.match(REG);

    if (!mat) {
        REG =/^([\s]*)#img\[([^\]]+)\][\s]([^#]+)#?/;
        mat = line.match(REG); 
        if (mat) {
            url = mat[3];
            attrsData = mat[2];
        }
    } else {
        url = mat[2];
    }

    if (!mat) {
        return "";
    }

    indent = this.spaceToIndentLength(mat[1]);
    style = "";
    divStyle = "";
    if (attrsData) {
        attributes = this.getAttributes(attrsData, indent);
        if (attributes.style) {
            style = ' style="' + attributes.style + '"';
        }
        if (attributes.attributes) {
            attributes.style = null;
            attr = this.attributesToString(attributes);
        }
    } else if (indent) {
        attr = ' class="indent' + indent + '"';
    }
    if (attributes && attributes.attributes.left === true ) {
        className = "pull-left";
    } else if (attributes && attributes.attributes.right === true) {
        className = "pull-right";
    }

    if (attributes && attributes.attributes.link) {
        if (attributes.attributes.link == "me") {
            attributes.attributes.link = url;
        }
        a = '<a href="'  + attributes.attributes.link +  '" target="_blank">';
    }


    img = '<img src="' +  url + '"  '+ attr + ' ' + style + '/>';
    if (a) {
        img = a + img +'</a>';
    }

    if (className) {
        //get end of image
        n = lines.lenght;
        i = obj.i + 1;
        line = lines[i];
        imgBlock = [];
        while (!line.match(REG_End)) {
            imgBlock.push(lines[i]);
            i++;
            if (i >= n) break;
            line = lines[i];
        }
        obj.i = i;

        content = this.transformSection(imgBlock);
        html = ['<div class="media media-image clearfix">',
                '<div class="'+ className +'">',
                    img,
                '</div>',
                '<div class="content">'];
        html = html.concat(content);
        html = html.concat(['</div>',
                '</div>']);
        return html;

    } else {
        
        return [img];
    }

};/*}}}*/

o.googleCodePretty = function(data,type,codelineNum) {//{{{
    var cls = "prettyprint", s = "";
    type = 'lang-'+type;
    cls += " "+type;
    cls += " linenums";
//    data=data.replace(/#/g,"");
    data = data.replace(/</g,"&lt;");
    var gcode=document.createElement('div');
    gcode.id="google-pretty-code";
    
    var pre=document.createElement('pre');
    pre.id="google-pretty";
    pre.innerHTML=data;
    pre.className=cls;
    document.body.appendChild(pre);

    prettyPrint(s);
    var s=document.getElementById('google-pretty').innerHTML;
    s=s.replace(/\\/g,'&#92;');
    var p=document.getElementById('google-pretty');
    p.parentNode.removeChild(p);

    return "\n"+'<pre class="'+cls+'" >'+s+'</pre>'+"\n";
};//}}}

//output  class="xxx" lang="xxx"
o.getAttributes = function (data, indent) {//{{{
    var attr = {}, REG, REG2, REG_CLASS, REG_Number, matches, match, i, n, style;
    if (!data) {
        data = "";
    }

    attr.class = "";
    style = "";
    REG = /([\w]+)=(([\w\-]+)|("[\w\-\s]+"))/ig;
    REG2 = /([\w]+)=([\w\-]+)/i;
    REG_WITH_QUOTE = /([\w]+)=[\s]*"([\w\-\s]+)"/i;

    REG_CLASS = /(^|[\s,]+)([a-z][\w\-]+)([,\s]|$)/i;
    REG_Number = /[0-9]+(?=[^=]|$)/g;
    REG_Float = /(^|[\s,]+)(left|right)(?=[^=]|$)/g;

    matches = data.match(REG);
    if (matches) {
        n = matches.length;
        for (i = 0; i < n; i++) {
            match = matches[i].match(REG2);
            if (match && match[2]) {
                attr[this.trim(match[1])] = this.trim(match[2]);
            } else {
                match = matches[i].match(REG_WITH_QUOTE);
                if (match) attr[this.trim(match[1])] = this.trim(match[2]);
            }

        }
    }

    match = data.match(REG_CLASS);
    if (match) {
        match[2] = match[2].replace(/[\s,]+/, '');
        attr['class'] = this.trim(match[2]);
    }

    if (indent) {
        attr['class'] += ' indent' + indent;
    }

    match = data.match(REG_Number);
    if (match) {
        if (match[0]) {
            style += 'width: ' + match[0] + 'px;';
        }
        if (match[1]) {
            style += 'height: ' + match[1] + 'px;';
        }

    }

    match = data.match(REG_Float);
    if (match) {
        match[0] = match[0].replace(/[,\s]+/, '');
        attr[match[0]] = true;
    }

    return {attributes: attr, style: style};
};//}}}

o.attributesToString = function (attributes) {//{{{
    var data= "", key;
    if (attributes.style) {
        data += ' style="' + attributes.style +'"';
    }
    if (attributes.attributes) {
        for (key in attributes.attributes) {
            if (attributes.attributes[key]) { 
                data += ' ' + key + '="' + attributes.attributes[key] +'"';
            }
        }
    }
    return data;
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


