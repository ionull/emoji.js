emoji.js
========

==Usage:

===In a browser:

~~~html
<script src="vendor/punycode/punycode.min.js"></script>
<script src="emoji-list-with-image.js"></script>
<script src="emoji.js"></script>
~~~

var html = ioNull.emoji.parse('your emoji string like: 🐭');

element.innerHTML = html;

===Node.js:

var ioNull = require('emoji.js');

console.log(ioNull.emoji.parse('✈'));

clone emoji.js

~~~ bash
git clone --recursive git@github.com:/ioNull/emoji.js.git
cd emoji.js
~~~

For older Git versions, just use:

~~~ bash
git clone git@github.com:/ioNull/emoji.js.git
cd emoji.js
git submodule update --init
~~~
