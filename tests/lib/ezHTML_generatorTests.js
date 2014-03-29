require("phplike");
var ez = require("../../lib/ezHTML_generator.js");

var g = new ez();
var text = file_get_contents("text.txt");


var section = g.getArticleSection(text);

//console.log(section);



var html = g.transform(text);
console.log(html);
