/*****
1. * => ul li
2. ---xxx   => a name  nav target_box
3. #code[js]# #code[c]#  -> code

5. #p 一般文字
6. #div[notice]  answer
7. #html# %htmlEnd%  output html
8. #T title
9. #img[url,width,height]alt#
10. #q quatation
11. flow[arrow] A->B->C
var ezHTML = ezHTML_generator();
ezHTML.transform(html);
******/
(function() {

/**
 consturctor
*/
function ezHTML_generator() {
    this.id = 0;
}


var o = ezHTML_generator.prototype;

/*******
Properties
*******/
//mainDomain: If domain of link is different with mainDomain, anchor will auto add target to be "_blank".
o.mainDomain='www.defult.com';

o.id = 0;
o.nowtag = Array();

//html_target is the all h2 tag, use this infomation to show catalog
o.html_target = Array();
o.html = Array();



/*********
Methods
**********/
o.loadGoogleCodePretty = function(baseUrl) {//{{{
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
      "lang-php.js",
      "lang-proto.js"
     // "lang-sh_my.js",
     // "lang-js_my.js",
     // "lang-linux.js"
  ];
  var styles = [
      //"prettify.css"
  ];
  for (var i = 0; i < sources.length; ++i) {
    var head=document.getElementsByTagName('head');
    var d=document.createElement('script');
    d.src=baseUrl + sources[i]
    head[0].appendChild(d);
  }
};//}}}

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
    var tar = this.html_target;
    var n = tar.length;
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
        lines[obj.i] = this.transformDoubleHash(lines[obj.i]);
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

            case 'demo':
                data = this.transformDemo(lines[obj.i]);
                if (data) {
                    html.push(data+"\n");
                }
                obj.i++
                break;

            case 'image':
                data = this.transformImage(lines, obj);
                if (data) {
                    html = html.concat(data);
                }
                obj.i++;
                break;
            case 'iframe':
                data = this.transformIframe(lines, obj);
                html.push(data);
                obj.i++
                break;
            case 'sourceCode':
                data = this.transformSourceCode(lines, obj);
                html.push(data);
                obj.i++
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

o.transformDoubleHash = function (c)
{//{{{
    if (c.indexOf('##') === -1) return c;
    var reg;
    reg = /##flow/;
    if (c.match(reg)) {
        return this.transformFlow(c);
    }
    return c;
}//}}}

o.transformHeader = function (line) {//{{{
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
};//}}}

//div span p ...
o.transformNormalTag = function (line) {//{{{
    var REG, matches, html, classText, tagName, content, attributes, attr, indent = "";
    attributes = "";
    REG = /^([\s]*)#([\w]+)(\[[^\]]+\])?[\s]*([^\n\r]+)/i;
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
    content = this.transformContent(content);

    if (!content) return [];
    switch (tagName) {
        case 'q':
            tagName = "blockquote";
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

    //demo
    var re_code=/#demo\[?[^\]]+\]?[^\r\n]*/;
    mat = line.match(re_code);
    if(mat) {return 'demo';}

    // source code as markdown
    reg = /^([\s]*)```/;
    mat = line.match(reg);
    if(mat) {return 'sourceCode';}



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

    reg = /#iframe/i; //img
    mat = line.match(reg);
    if (mat) {return 'iframe';}


    //html
    reg = /^([\s]*)#html#/i;
    mat = line.match(reg);
    if(mat) {return 'html';}

    //normal tag: all html tag - div span ...
    reg = /^([\s]*)#([a-z]+)/i; //code
    mat = line.match(reg);
    if(mat) {return 'normalTag';}


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
2. `xxx`: <code>xxx</code>
3. remove '\'
**/
o.transformContent = function(line) {/*{{{*/
    // handle link
    var link;
    var re_http=/(^|[\s])http[s]?:\/\/([^\/]+)[^\s'"\n\r]+/;
    var k = line.match(re_http);
    if (k && k[2]) {
        var tar = "";
        re_http = /http[s]?:\/\/([^\/]+)[^\s'"\n\r]+/;
        if (k[2] != this.mainDomain) {
            tar=' target="_blank"';
        }
        link = this.trim(k[0]);
        line = line.replace(re_http,'<a href="' + link + '" '+tar+'>'+ link +'</a>');

    }

    // handle code block as markdown
    line = line.replace(/`([^\`]+)`/g, '<code>$1</code>');

    // remove '\'
    var re_strip=/([\\]+)/g;
    line = line.replace(re_strip,'&#92;');
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
    var n = lines.length;
    var codelineNum=0;
    obj.i++
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
                var d="<div class=\"codeBlock "+mat[1]+"\"><span class=\"title\">"+title+"</span>";
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
o.transformDemo = function(data) {//{{{
    var i ,n;
    var REG, REG_target, matches, html, classText, attrString, content, attributes, attr, url = "", dataInfo = {}, isPopup = false, className, targetMatch, target = "";

    className = "demo-link"
    content = "View Demo";
    REG = /^([\s]*)#demo(\[[^\]]+\])?[\s]*([^\s]+)[\s]?([^\n\r]*)/i;
    REG_target = /target=[\'\"]?([\w]+)[\"\']?/;
    matches = data.match(REG);


    if (matches) {
        attrString = matches[2];
        url = matches[3];
    }

    if (attrString) {
        attr = attrString.replace(/[\[\]]/g, '').split(/[,]/);
        n = attr.length;
        for (i = 0 ; i < n; i++) {
            if (attr[i] == "popup") {
                isPopup = true;
            } else if (!attr[i].match(/[^0-9]/)) {
                if (!dataInfo.width) {
                    dataInfo.width = attr[i];
                } else {
                    dataInfo.height = attr[i];
                }
            }
        }
        targetMatch = attrString.match(REG_target);
        if (targetMatch && targetMatch[1]) {
            target = 'target="' + targetMatch[1] + '"';
        }
    }

    if (matches && matches[4]) {
        content = matches[4];
    }

    if (isPopup == true) {
        className += " ezHTML-popup";
    }

    if (!dataInfo.width) {
        dataInfo.width = 200;
        dataInfo.height = 100;
    }

    dataInfo = this.jsonToString(dataInfo);
    dataInfo = encodeURIComponent(dataInfo);
    html = '<a class="%s" %s href="%s" data-info="%s"><i class="glyphicon glyphicon-file"></i>%s</a>';
    html = this.sprintf(html, className, target, url, dataInfo, content);

    return html;

}//}}}


o.transformImage = function(lines, obj) {/*{{{*/
    var i, n, line, REG, mat, url, attrsData, style, attributes, attr = "", divStyle, html, content, className, REG_End, imgBlock, a, img, indent, target;
    img = "";
    REG = /^([\s]*)#img[\s]([^#]+)#?/;
    REG_End = /[\s]*#imgEnd#/;
    line = lines[obj.i];
    mat = line.match(REG);

    if (!mat) {
        REG =/^([\s]*)#img(\[[^\]]+\])[\s]([^#]+)#?/;
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
        if (attributes.attributes.target && attributes.attributes.target == "this") {
            target = "";
        } else {
            target = "target=\"_blank\"";
        }
        a = '<a href="'  + attributes.attributes.link +  '" ' + target + ' >';
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
        html = ['<div class="media media-image">',
                '<div class="'+ className +'">',
                    img,
                '</div>',
                '<div class="media-body">'];
        html = html.concat(content);
        html = html.concat(['</div>',
                '</div>']);
        return html;

    } else {

        return [img];
    }

};/*}}}*/

o.transformIframe = function(lines, obj) {/*{{{*/
    var i, n, line, REG, mat, url, attrsData, style, attributes, attr = "", html, REG_End, content = "", afterJS = "", id = "", idData = "";
    img = "";
    REG = /^([\s]*)#iframe[\s]([^#]+)#?/;
    REG_End = /[\s]*#iframeEnd#?/;
    line = lines[obj.i];
    mat = line.match(REG);
    if (!mat) {
        REG =/^([\s]*)#iframe(\[[^\]]+\])[\s]([^#]+)#?/;
        mat = line.match(REG);
        if (mat) {
            url = mat[3];
            attrsData = mat[2];
        }
    } else {
        url = mat[2];
    }

    if (!mat) {
        i = obj.i + 1;
        n = lines.lenght;
        line = lines[i];
        while (!line.match(REG_End)) {
            content += lines[i];
            i++;
            if (i >= n) break;
            line = lines[i];
        }
        obj.i = i;
    }
    if (!mat && !content) return "";
    style = "";
    if (attrsData) {
        attributes = this.getAttributes(attrsData, "");
        if (attributes.style) {
            style = ' style="' + attributes.style + '"';
        }
        if (attributes.attributes) {
            attributes.style = null;
            attr = this.attributesToString(attributes);
        }
    }
    if (attributes && attributes.attributes.left === true ) {
        className = "pull-left";
    } else if (attributes && attributes.attributes.right === true) {
        className = "pull-right";
    }

    if (content) {
        id = "ez-iframe-" +(this.id++);
        idData = 'id="'+id+'"';
        url = "javascript:false;";
        content = content.replace(/[\r\n]+/, '');
        //afterJS = document.querySelector("#' +(id)+'").contentWindow.document.body.innerHTML="'+content+'";
    }

    html = '<iframe src="' +  url + '" ' + style +" "+ idData + ' class="ez-iframe"></iframe>';
    if (attributes && attributes.attributes && attributes.attributes.link) {
        html += '<div><a href="'+url+'" target="_blank">另開視窗<i class="glyphicon glyphicon-new-window"></i></a></div>';
    }
    return html + afterJS;
};/*}}}*/

o.transformSourceCode = function(lines, obj) {/*{{{*/
    var i, n, line, REG_Start, REG_End, jmat, url, content = "", html = "", sourceType = "term";
    img = "";
    REG_Start = /^([\s]*)```([a-zA-Z]*)/;
    REG_End = /([\s]*)```/;
    i = obj.i;
    line = lines[i];
    n = lines.lenght;
    mat = line.match(REG_Start);
    if (mat) {
        if (mat[2]) sourceType = mat[2];
        lines[i] = "#code[" + sourceType + "]#";
        i++;
        line = lines[i];
        while (!line.match(REG_End)) {
            i++;
            if (i >= n) break;
            line = lines[i];
        }
        lines[i] = '#codeEnd#';
    } else {
        return "";
    }
    return this.transformCode(lines, obj);
};/*}}}*/

o.transformFlow = function (c)
{//{{{
    var reg, mat, mat2, i ,n, setting, items, item, itemN, newVal = "", orgVal, tail = "";
    reg = /\[?([^]+])?\]?[\s]+(.+)/;
    mat = c.split(/##flow/);
    if (!mat && !mat[1]) return c;
    n = mat.length;
    for (i = 1; i < n ; i++) {
        mat2 = mat[i].match(reg);
        if (mat2 && mat2[1]) {
            if (mat2[2]) {
                setting = mat2[2];
                switch (setting) {
                    case "arrow":

                        break;
                }
                orgVal = mat2[2];
            } else {
                orgVal = mat2[1];
            }
            // Handle each item
            items = orgVal.split(/->/);
            itemN = items.length;
            for (var j in items) {
                item = items[j];
                if (j == (itemN - 1)) {
                    var empPos = item.indexOf(' ');
                    if (empPos != -1) {
                        tail = item.substring(empPos, item.length);
                        item = item.substring(0, empPos);
                    }
                }
                if (j > 0 && j <= itemN) newVal += '<span class="glyphicon glyphicon-chevron-right"></span>';
                newVal += '<span class="flow-item">'+item+'</span>';
            }
            newVal += tail;
        } else {
            newVal = mat[i];
        }
        mat[i] = newVal;
    }
    return mat.join('');
}//}}}

o.googleCodePretty = function(data,type,codelineNum) {//{{{
    var cls = "prettyprint", s = "";
    type = type;
    cls += " lang-"+type;
    cls += " linenums";

    data = this.trim(data);

    data = data.replace(/</g,"&lt;");
    data = prettyPrintOne(data, type, true);
    return "\n"+'<pre class="'+cls+'" >'+data+'</pre>'+"\n";
};//}}}

//output  class="xxx" lang="xxx"
o.getAttributes = function (data, indent) {//{{{
    var attr = {}, REG, REG2, REG_CLASS, REG_Number, matches, match, i, n, style;
    if (!data) {
        data = "";
    }

    attr.class = "";
    style = "";
    REG = /([\w]+)=(([^'"\]]+)|("[^'"\]]+"))/ig;
    REG2 = /([\w]+)=["]?([^"'\]]+)["]?/i;
    REG_WITH_QUOTE = /([\w]+)=[\s]*"([\w\-\s]+)"/i;
    REG_CLASS = /(^\[|[\s,]+)([a-z][\w\-]*)([,\s]|\]$)/i;
    REG_Number = /[0-9%]+(?=[^=]|$)/g;
    REG_Float = /(^\[|[\s,]+)(left|right)(?=[^=]|\]$)/g;

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
        if (!attr['class']) {
            attr['class'] = this.trim(match[2]);
        } else {
            attr['class'] += ' ' + this.trim(match[2]);
        }
    }

    if (indent) {
        attr['class'] += ' indent' + indent;
    }

    match = data.match(REG_Number);
    if (match) {
        if (match[0]) {
            if (match[0].indexOf('%') != -1) {
                style += 'width: ' + match[0] + ';';
            } else {
                style += 'width: ' + match[0] + 'px;';
            }
        }
        if (match[1]) {
            style += 'height: ' + match[1] + 'px;';
        }

    }

    match = data.match(REG_Float);
    if (match) {
        match[0] = match[0].replace(/[,\s\[\]]+/, '');
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


o.jsonToString = function (arr) {//{{{
   var s="";
   if( arr instanceof Array || arr instanceof Object){
      var isObj=0;
      //check value type
      for(key in arr){
         if( isNaN(parseInt(key)) ){ //key is string
            isObj=1;
         }
         else{
            //key is index , check sort
            var na=arr.length;
            var tmp=arr;
                         //hack for ie
            arr=Array();
            for(var j=0;j<na;j++){
               if( typeof(tmp[j])=="undefined" ){
                  arr[j]="";
               }
               else{
                  arr[j]=tmp[j];
               }
            }
         }
         break;
      }

      for(key in arr){
         var value=arr[key];
         if( isObj ){
            if(s){s+=',';}
            s+='"'+key+'":' + this.jsonToString(value);
         }
         else{
            if(s){s+=',';}
            s += this.jsonToString(value);
         }
      }
      if(isObj)
         s='{'+s+'}';
      else
         s='['+s+']'
   }
   else{
      if(!isNaN(parseInt(arr))){
         s+=arr;
      }
      else{
         s='"'+arr+'"';
      }
   }
   return s;
};//}}}

if (typeof(window) != "undefined") {
    window['ezHTML_generator'] = ezHTML_generator;
}

if (typeof(module) != "undefined") {
    module.exports = ezHTML_generator;
}

}());
