

var ez = require("../../lib/ezHTML_generator.js");
global.window = [];


var ezHTML = new ez();
/*

require("phplike");
var text = file_get_contents("text.txt");


//var section = g.getArticleSection(text);

//console.log(section);
var html = g.transform(text);
console.log(html);*/

var isDebug = false;
if (global.process.execArgv) {
    var param = global.process.execArgv.join(" ");
    if (param.match(/--debug/)) {
        isDebug = true;
    }
}

var assert = require("assert")

//mocha lib/ --grep html
describe('Normal html tag', function(){
    it('Test # to h1', function(){
        var text = '# h1 title';
        var result = ezHTML.transform(text);
        assert.equal("<h1>h1 title</h1>", result);
    });

    it('Test #h1 to h1', function(){
        var text = '#h1 h1 title';
        var result = ezHTML.transform(text);
        assert.equal("<h1>h1 title</h1>", result);
    });


    it('Test ## to h2', function(){
        var text = '## h2 title';
        var result = ezHTML.transform(text);
        assert.equal("<h2>h2 title</h2>", result);
    });

    it('Test #div to div', function(){
        var text = '#div div content';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal("<div>div content</div>", result);
    });


});

describe('Normal html attribute', function(){
    it('Test class', function(){
        var text = '#h4[class=aa] h4';
        var result = ezHTML.transform(text);
        assert.equal(1, result.match(/class="aa"/).length);

        var text = '#h4[class="aa"] h4';
        var result = ezHTML.transform(text);
        assert.equal(1, result.match(/class="aa"/).length);

        var text = '#h4[aa] h4';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/class="aa"/).length);

        var text = '#div[a] div content';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/class="a"/).length);

    });

    it('Test width 100px', function(){
        var text = '100,200';
        var result = ezHTML.getAttributes(text);
        assert.equal("width: 100px;height: 200px;", result.style);
    });

    it('Test width 100%', function(){
        var text = '100%, 200';
        var result = ezHTML.getAttributes(text);
        assert.equal("width: 100%;height: 200px;", result.style);
    });

});

describe('Normal html link', function(){
    it('Test link', function(){
        var text = '#p b http://aa.bb.cc/a.html';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/<a/).length);

    });
    it('Test link', function(){
        var text = '#p http://aa.bb.cc/a.html';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/<a/).length);

    });

    it('Test link', function(){
        var text = '* http://aa.bb.cc/a.html';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/<a/).length);

    });

    it('Test link', function(){
        var text = '* http://aa.bb.cc/a.html b';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);

        assert.equal(1, result.match(/a\.html<\/a>/).length);

    });



});




//mocha lib/ --grep Image -d
describe('Image html tag', function(){
    it('Test #img to img', function () {
        var text = '#img[100] ../img.jpg';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/<img/).length);
        assert.equal(1, result.match(/src="..\/img.jpg"/).length);
        assert.equal(1, result.match(/style="width: 100px;"/).length);


    });

    it('Test #img to img with class name', function () {
        var text = '#img[float-left] ../img.jpg';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/class="float-left"/).length);


    });

    it('Test #img image left, text right', function () {
        var text = '#img[left] ../img.jpg  \n \
                    #div content \n \
                    #imgEnd#';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/class="pull-left"/).length);


    });

    it('Test #img image right, text right', function () {
        var text = '#img[right] ../img.jpg  \n \
                    #div content \n \
                    #imgEnd#';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/class="pull-right"/).length);


    });

    it('Test #img indent', function () {
        var text = '    #img ../img.jpg';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/indent2/).length);


    });

    it('Test #img link', function () {
        var text = '#img[width="300",link="me",target="_blank"] ../img.jpg';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        //console.log(result);
        assert.equal(1, result.match(/a href="..\/img.jpg" target="_blank"/).length);
    });


});

//mocha lib/ --grep Quoteblock -d
describe('Quoteblock html tag', function(){
    it('Test #q to quoteblock', function () {
        var text = '  #q test';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/<blockquote/g).length);
        assert.equal(1, result.match(/indent1/g).length);

    });


});


//mocha lib/ --grep Table -d
describe('Table html tag', function(){
    it('Test |x | x | to table', function () {
        var text = '| *T1| *T2| *T3| \n \
                    | C1 | C2 | C3 |';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/<table/g).length);
        assert.equal(1, result.match(/<th>T1<\/th>/g).length);
        assert.equal(1, result.match(/<td>C3<\/td>/g).length);

    });


});

//mocha lib/ --grep flow
describe('flow', function(){
    it('Test ##flow to html', function () {
        var text = 'zz ##flow[arrow] A->B->C zzzz';
        var result = ezHTML.transformFlow(text);

        if (isDebug) console.log(result);

    });


});


//mocha lib/ --grep codeblock
describe('codeblock', function(){
    it('Test code bloack `xxx` to <code>xxx</code>', function () {
        var text = '#p Test `xxx`';
        var result = ezHTML.transform(text);

        if (isDebug) console.log(result);
        assert.equal("<p>Test <code>xxx</code></p>", result);

    });


});
