// Copyright Tsung Wu <tsung.bz@gmail.com>
// twitter: @ioNull
// github: http://github.com/ioNull/emoji.js
// 
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

;(function(root) {
	var list;
	if (typeof require != 'undefined') {
		getEmojiListObj = require('./emoji-list-with-image');
		punycode = require('./vendor/punycode/punycode.min.js');
		list = getEmojiListObj.getEmojiList();
	} else {
		list = root.getEmojiList();
	}

	if (typeof console === 'undefined') {
		console = {
			log: function() {}
		};
	}
	var emoji = {
		parse: function(what) {
			var unicodes;
			if (what) {
				unicodes = punycode.ucs2.decode(what);
			} else {
				return '';
			}
			//console.log(unicodes.length);
			var unicodeString = '';
			var kinds = list;
			for (var now = 0; now < unicodes.length;) {
				var unicode = unicodes[now];
				var isEmoji = false;
				var isEmojiUnicode = false;
				if (unicode >= 0xE000 && unicode < 0xE538) {
					unicodeString = unicode.toString(16);
					//console.log('it is emoji: ' + unicode + punycode.ucs2.encode([unicode]) + ' : ' + unicodeString);
					//replace with img directly
					isEmoji = true;
				} else if (
				//左上左下右上右下箭头
				(unicode >= 0x2196 && unicode <= 0x2199) ||
				//左右三角箭头
				(unicode == 0x25C0 || unicode == 0x25B6) ||
				//2三角左右
				(unicode == 0x23EA || unicode == 0x23E9) || (unicode >= 0x2600 && unicode <= 0x3299) || (unicode >= 0x1f000 && unicode <= 0x1f700)) {
					unicodeString = unicode.toString(16);
					//console.log('it is unicode 6 emoji: ' + unicode + punycode.ucs2.encode([unicode]) + ' : ' + unicodeString);
					//we need to find out what is mapped
					isEmoji = true;
					isEmojiUnicode = true;
				} else {
					//console.log('it is not emoji' + unicode);
					//数字和#号
					if (unicode == 0x20e3) {
						if (now > 0) {
							//check if previous is a number or #
							var preCode = unicodes[now - 1];
							if (preCode == 0x23 || preCode >= 0x30 && preCode <= 0x39) {
								//console.log('it is a number unicode: ' + preCode);
								isEmoji = true;
								isEmojiUnicode = true; --now;
								unicode = preCode;
							}
						}
					}
				}

				if (isEmoji) {
					for (var i = 0; i < kinds.length; ++i) {
						var kind = kinds[i];
						for (var j = 0; j < kind.length; ++j) {
							var emo = kind[j];
							var foundCount = 0;
							var unicodeEmoji = emo[1];
							if (isEmojiUnicode) {
								var isArray = (typeof unicodeEmoji != 'string');
								if (isArray && now + unicodeEmoji.length - 1 < unicodes.length) {
									//console.log('is array :' + now + ' ' + unicodeEmoji.length);
									for (var uindex = 0; uindex < unicodeEmoji.length; uindex++) {
										var unString = unicodes[now + uindex].toString(16);
										//console.log('unString is: ' + unString);
										if (unString != unicodeEmoji[uindex]) {
											foundCount = 0;
											break;
										} else {
											foundCount++;
										}
									}
									//console.log('emojis string is: ' + emo[0] + ' count: ' + foundCount);
								} else if (!isArray && emo[1] == unicodeString) {
									foundCount = 1;
								}
							} else if (!isEmojiUnicode && emo[0] == unicodeString) {
								foundCount = 1;
							}

							if (foundCount > 0) {
								//console.log('emojis string is: ' + emo[0] + ' count: ' + foundCount);
								var data = 'data:image/png;base64,' + emo[2];
								var html = '<img style="display: inline;vertical-align: middle;" src="' + data + '"/>';
								//console.log('img is: ' + html);
								//remove old text, add html string
								var puny = punycode.ucs2.decode(html);
								//console.log('puny length: ' + puny.length);
								unicodes.splice(now, foundCount);
								for (var curr = 0; curr < puny.length; ++curr) {
									unicodes.splice(now, 0, puny[curr]);
									//move next
									++now;
								}
								//index increase next loop
								--now;
								//console.log('unicodes length: ' + unicodes.length);
								break;
							}
						}
					}
				}++now;
			}
			//console.log('unicodes length: ' + unicodes.length);
			var html = punycode.ucs2.encode(unicodes);
			return html;
		},
	};

	var ioNull = {
		emoji: emoji
	};

	function extend(a, b) {
		for (var prop in b) {
			if (typeof b[prop] === 'undefined') {
				delete a[prop];
				// Avoid "Member not found" error in IE8 caused by setting window.constructor
			} else if (prop !== 'constructor' || a !== root) {
				a[prop] = b[prop];
			}
		}
		return a;
	};
	if (typeof exports === 'undefined') {
		if (typeof root.ioNull === 'undefined') {
			root.ioNull = ioNull;
		} else {
			extend(root.ioNull, ioNull);
		}
	} else { // 支持exports方式
		extend(exports, ioNull);
	}
})(this);

