(function(){

	/*****
	ob => source 原始textarea的id
	destination_view 預覽處
	destination 要存轉換後的html textarea
	paragraphMenu 段落選單
	*****/
	var isloadGoogleCode=0;
	var self;
	var cursPos; // 窗口全局变量，保存目标 TextBox 的最后一次活动光标位置
	//{"source":"t1","destination_view":"view","destination":"t2"}

	/**
	view 顯示處

	**/
	function ezHTML_GUI(config) {//{{{
        var foot = "";
		this.config=config;
		this.paragraph=Array();
		this.editParagraphNum=-1;
		self = this;
		this.text = new ezHTML_generator();

		if (isloadGoogleCode!=1) {
			this.text.loadGoogleCodePretty(this.config.googleCodePerttyBaseUrl);
			isloadGoogleCode=1;
		}

		if (this.config.iframe) {
			var f = document.getElementById(this.config.iframe);
			var head = '';

    		if (this.config.css) {
				var n=this.config.css.length;

				for(var i=0 ; i<n;i++){
					if(i>0) {
                        head+='\n';
                    }
					head += '<link href="'+this.config.css[i]+'" rel="stylesheet" type="text/css" />';
				}

			}

    		if (this.config.js) {
				n = this.config.js.length;

				for(i=0 ; i<n;i++){
					if(i>0) {
                        head+='\n';
                    }
					foot += '<script src="'+this.config.js[i]+'" type="application/javascript"></script>';
				}

			}


			f.contentWindow.document.open();
			f.contentWindow.document.write('<html><head>'+head+'</head><body></body> ' + foot + '</html>');
			f.contentWindow.document.close();
			//f.contentWindow.document.innerHTML='<html><head>'+head+'</head><body></body></html>';
            console.log(this.config);
            if (this.config.autoUpdateMs && this.config.autoUpdateMs > 0) {
                this.autoUpdate();
            }
		}
		this.setEvent();
	}//}}}

	var o = ezHTML_GUI.prototype;
	o.setEvent = function() {
		$(this.config.source).keydown(this.keydown);
	};

	o.keydown = function(event) {
		var code = event.keyCode;
		if (code == 9) {
			var s = $(self.config.source);
			self.insertAtCursor(s[0],'  ');
            event.preventDefault();
			return false;
		}

	};

	o.insertAtCursor=function(myField, myValue) {
	 //fixed scroll position
	 textAreaScrollPosition = myField.scrollTop;
		//IE support
		if (document.selection) {
			myField.focus();
			//in effect we are creating a text range with zero
			//length at the cursor location and replacing it
			//with myValue
			sel = document.selection.createRange();
			sel.text = myValue;
		//Mozilla/Firefox/Netscape 7+ support
		} else if (myField.selectionStart || myField.selectionStart == '0') {
			myField.focus();
			//Here we get the start and end points of the
			//selection. Then we create substrings up to the
			//start of the selection and from the end point
			//of the selection to the end of the field value.
			//Then we concatenate the first substring, myValue,
			//and the second substring to get the new value.
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
			myField.setSelectionRange(endPos+myValue.length, endPos+myValue.length);
		} else {
			myField.value += myValue;
		}
		//fixed scroll position
		myField.scrollTop = textAreaScrollPosition;

	}


	//將程式碼轉成可讀的文件 (當前內容)
	o.transform = function() {
        var text;
		//save the html of editing paragraph.
		self.saveParagraph();
        text = $(this.config.source).val();
		var html = this.text.transform(text);
		$("#"+this.config.destination).val(html);
		if (this.config.iframe) {
			var f = document.getElementById(this.config.iframe);
			f.contentWindow.document.body.innerHTML = html;
			//$('#'+this.config.iframe).html(s);
		} else {
        	$("#"+this.config.destination_view).html(html);
        }
	};

	//轉換全部內容
	o.transformAll = function() {//{{{
		if (self.editParagraphNum >= 0) {
			//save content in the textarea
			self.saveParagraph();
			self.editParagraphNum = -1; // User is editing all ocontent, set edit paragraph to -1
		} else {
			self.splitParagraph();
			self.outputPieceTable();
		}

		var n = self.paragraph.length;
		var html = "";
		for (var i=0;i<n;i++) {
			html += self.paragraph[i].content;
		}

		$(self.config.source).val(html);
        self.transform();
		try {
	    	//	self.transform();
		} catch(err) {
            console.log(err);
			alert("程式發生錯誤。");
		}
	};//}}}



	//Split code to multi paragraph by h2
	o.splitParagraph = function() {//{{{
		var code = $(this.config.source).val();
		var re=/[^#](##|#h2)[\s]/i, mat, mat2, code2, search, search2;
		var re2=/([a-z]+)/, data;

		search = code.search(re);
		this.paragraph=Array();
		this.paragraph[0] = Object();
		if (search == -1) {//格式不對的話
			this.paragraph[0].content = $(this.config.source).val();
			this.paragraph[0].position="";
			return true;
		}

		this.paragraph[0].content = code.substr(0,search);
		this.paragraph[0].position = "";
		code = code.substr(search,code.length-search);
		data = "";

		while (mat=code.match(re)) {
			search2 = this.getMenuStartPosition(mat,code);

			if (search2==-1) {
				search2=code.length;
			} else {
				//search2=search2+mat[0].length+1;
			}
			data += code.substr(0,search2);

			mat2 = mat[1].match(re2);
			var len = this.paragraph.length;
			this.paragraph[len]=Object();
			if(mat2 && mat2[1]){
				this.paragraph[len].position=mat2[1];
			} else {
				this.paragraph[len].position="";
			}
			this.paragraph[len].content = data;
			code = code.substr(data.length,code.length-data.length);
			data="";

		}
	};//}}}

	/****抓下一個##的開始位置****/
	o.getMenuStartPosition = function(mat,code) {
		var re=/[^#](##|#h2)[\s]/;
		var pos,len=0;
		len=mat.index+mat[0].length+1;
		code2=code.substr(len,code.length-(len) );

		pos=len;
		var k=code2.match(re);
		if(!k){
			pos+=code2.length;
		}
		while(k && k[0]){
			if(k[0].search(/%/)>0){
				len=k.index+k[0].length+1;
				pos+=len;
			}
			else{
				pos+=k.index;
				break;
			}

			code2=code2.substr(len,code2.length-(len) );
			k=code2.match(re);
			if(!k){
				pos+=code2.length;
				break;
			}
		}
		return pos;
	}

	//輸出 各個片段的 move table
	o.outputPieceTable = function() {//{{{
		var html = "", li, ul;
		var n = this.paragraph.length,i,mat,title;
		var re = /[\s]*(##|#h2)[\s]([^\n\r]+)/,p,a;
		$("#" + self.config.paragraphMenu).html('');
        ul = document.createElement('ul');
        ul.className = "list-group";
  		for (i = 0; i < n; i++) {
			if (!this.paragraph[i].content || !this.paragraph[i].content.trim()) {
                continue;
            }
			mat = this.paragraph[i].content.match(re);

			if (mat && mat[2]) {
				title = mat[2];
			} else {
				title = "Beginning";
			}

	        li = document.createElement('li');
            li.className = "list-group-item";
			a = document.createElement('a');
			a.innerHTML = title.substr(0,10);
			a.href="#";
			a.i=i;

			$(a).click(function(event){
				self.editParagraph(this.i);
				return false;
			});
			$(a).mouseup(function(event) {
				if(event.button==2){
					if(window.confirm('Delete it?'))
						self.deleteParagraph(this.i);
					return false;
				}

				return false;
			});

            li.appendChild(a);
            ul.appendChild(li);
		}

	    $("#"+this.config.paragraphMenu).append(ul);

		a = document.createElement('a');
		a.innerHTML = "New Section";
		a.href = "#";
		a.style.display = "block";
		a.style.marginTop = "10px";
		$(a).click(function() {
			self.addNewParagraph();
			return false;
		});
		$("#" + this.config.paragraphMenu).append(a);
	};//}}}


	/****段落處理****/
	o.addNewParagraph=function(){
        var n=self.paragraph.length;
        self.paragraph[n]=Array();
        self.paragraph[n].content="%---New Paragraph";
        self.paragraph[n].type="";
        self.outputPieceTable();
        self.editParagraphNum=n;
        self.editParagraph(n,'nosave');
	};

	//edit a paragraph
	o.editParagraph=function(p,type) {
		if (!type || type!='nosave') {
			self.saveParagraph();//先儲存上一筆
        }
		$(self.config.source).val(self.paragraph[p].content.trim());
		self.editParagraphNum=p;
	};

	//儲存當前內容進入目標 paragraph
	o.saveParagraph=function(){
		if(self.editParagraphNum>=0){
			self.paragraph[self.editParagraphNum].content=$(self.config.source).val();
		}
	};

	//刪除段落
	o.deleteParagraph=function(p){//{{{
		var n=self.paragraph.length;
		var newp=Array();
		for(var i=0;i<n;i++){
			if(i==p){
				continue;
			}
			newp[newp.length]=self.paragraph[i];
		}
		self.paragraph=newp;
		self.outputPieceTable();
	};//}}}

	o.paragraphContextMenu = function(event) {//{{{

		var t='<div class="_btnMenuBox">';
		t+='<div class="btn_ambtn2"><a href="#" onclick="_callEditionUI(1);return false;">刪除</a></div>';
		t+='</div>';
		if(!document.getElementById('_editionBtnBox')){
			$(document.body).append('<div id="_editionBtnBox" class="PT_editionBtnBox"></div>');
		}
		$("#_editionBtnBox").html(t);
		if(!event)
			var event=window.event;
		var l=event.clientX+$(window).scrollLeft()+10;
		var t=event.clientY+$(window).scrollTop()+10;
		if(l>$(document).width()-100){l-=80;}
		if(t>$(document).height()-100){t-=80;}
		$("#_editionBtnBox").css({zIndex:"110",position:"absolute",left:l,top:t,display:"block"});

		return false;
	};//}}}

    o.autoUpdate = function()  {
        console.log("ezHTML auto update");
        try {
            this.transformAll();
        } catch (e) {
            console.log("failed to transformAll, err = ", e);
        }
        setTimeout(this.autoUpdate.bind(this), this.config.autoUpdateMs);
    }

	String.prototype.trim = function()
	{
		return this.replace(/(^[\\s]*)|([\\s]*$)/g, "");
	}
	String.prototype.lTrim = function()
	{
		return this.replace(/(^[\\s]*)/g, "");
	}
	String.prototype.rTrim = function()
	{
		return this.replace(/([\\s]*$)/g, "");
	}

	window.ezHTML_GUI = ezHTML_GUI;
}())
