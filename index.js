var path = require('path')
var functions = require('./functions.js')

var info = {
  filename: process.argv[2],
  falsePositiveP: process.argv[3]
}

if (!info.filename || !info.falsePositiveP) {
  console.log('Usage: node index.js <filename> <false_positive_p>')
  process.exit(0)
}

if (info.falsePositiveP <= 0.000 || info.falsePositiveP >= 1) {
  console.error('false_positive_p must be > 0 and < 1')
  process.exit(1)
}

// 1. load the file
var langsFile = path.join(__dirname, info.filename);

  functions.loadLanguages(langsFile, function (err, json) {
  	if (err) { console.error(err); process.exit(2); }

	var bloomfilters = new Array();

	var langs = Object.keys(json.languages);
    for (var i=0; i < langs.length; i++) { 
		var langObj = json.languages[langs[i]];
		functions.buildBloomFilterForLanguage(langs[i], langObj.filename, bloomfilters, info.falsePositiveP);
	}
  });


  
  // hacer una UI con un input y un botón
  
  // que al presionar el botón separe las palabras y cuente 
  // count[lang] += BF[lang].test(word)? 1 : 0
  
  // mostrar el resultado ordenado por count (desc) 
  // <lang> : count[lang] / totalWords




