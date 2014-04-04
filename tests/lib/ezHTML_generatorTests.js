

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

    it('Test #img indent', function () {
        var text = '    #img ../img.jpg';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/indent2/).length);


    });


});

//mocha lib/ --grep Quoteblock -d
describe('Quoteblock html tag', function(){
    it('Test #q to quoteblock', function () {
        var text = '  #q test';
        var result = ezHTML.transform(text);
        if (isDebug) console.log(result);
        assert.equal(1, result.match(/<quoteblock/g).length);
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

