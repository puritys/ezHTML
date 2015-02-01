(function() {

/**
 consturctor
*/	
function ezHTML_main() {

};

var o = ezHTML_main.prototype;
o.prefix = "ezHTML";

o.popup = function (E) {
    var node, THIS, url, left = 300, top = 220, dataInfo;
    THIS = E.data.context;
    E.preventDefault();
    E.stopPropagation();
    
    node = $(E.currentTarget);
    url = node.attr('href');
    dataInfo = node.attr('data-info');
    dataInfo = decodeURIComponent(dataInfo);
    eval("dataInfo = " + dataInfo);
    if (dataInfo) {
        if (dataInfo.width) {
            left -= dataInfo.width/2;
        }
        if (dataInfo.height) {
            top -= dataInfo.height/2;
        }
        if (top <= 0) top = 50;
        if (left < 0) left = 50;
    }

    window.open(url, "ezHTML_popup", "width=" + dataInfo.width + ", height=" + dataInfo.height + ",  resizable=yes, status=no, top=" + top + ", left=" + left);
};

o.initial = function () {
    $('.' + this.prefix + '-popup').bind("click", {context: this}, this.popup);

};

var main = new ezHTML_main();
$(document).ready(function () {
    main.initial(); 
});


//end
})();
