# ezHTML

ezHTML is a easy HTML editor like markdown.

But It has more features than markdown,  support dynamic HTML and have a better CSS style and javascript UI.

## Normal HTML Tag

<pre>
# This is a h1 tag.
## This is a h2 tag.
### This is a h3 tag.
#h1 This is a h1 tag.
#h6 This is a h6 tag.
#div This is a div tag.
#span This is a span tag.
</pre>

## Image Tag

> img[class,width,height, attribute=xxx]

<pre>
#img[class,100,50, alt="a link"] http://www.yahoo.com/xxx/xxx.jpg
</pre>

## Table Tag

<pre>
| *Chrome | *Firefox | *IE    |
| Yes     | Yes      | IE6+   |
</pre>

## Text wrap Image

> Image is in the left.

<pre>
#img[left,200,100] image.jpg#
#div Here is the content of article wrap by a html tag "div".
#imgEnd#
</pre>

> Image is in the right.

<pre>
#img[right,200,100] image.jpg#
#div Here is the content of article wrap by a html tag "div".
#imgEnd#
</pre>


## Show PHP/CSS/JS/C++ Code

<pre>
#code[js]#
var b="faw";
var c="fawf";
function test(){
    var gseg="gseg";
    var gseg="gseg";
}
#codeEnd#
</pre>

