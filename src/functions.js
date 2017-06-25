var fs = require('fs')
var path = require('path')
var BloomFilter = require('./bloomfilter.js')

/**
 * Load the languages file
 *
 * (string, (?Error, ?Object))
 */
module.exports.loadLanguages = function (langFile, callback) {
  fs.readFile(langFile, function (err, res) {
    if (err) { return callback(err) }

    var languages
    try {
      languages = JSON.parse(res)
    } catch (e) {
      return cb(err)
    }

    return callback(null, { file: langFile, languages: languages })
  })
} 

function loadDictionary (dictFile, callback) {
  var res = fs.readFileSync(dictFile);
  var lines = res.toString('utf8').split('\n');
  return {words: lines};
}

/**
 * Load the dictionary
 *
 * (string, (?Error, ?Object))
 */
module.exports.loadDictionary = loadDictionary;

module.exports.buildBloomFilterForLanguage = function (fileDict, falsePositiveP) {
	var dictionary = loadDictionary (fileDict);
    var bf = new BloomFilter(dictionary.words.length, falsePositiveP);
    for (var wi = 0; wi < dictionary.words.length; wi++) {
      bf.add(dictionary.words[wi]);
    }
    return bf;
}

function compareLangsByHitsDesc(l1, l2) {
  if (l1.hits > l2.hits)
    return -1;
  if (l1.hits < l2.hits)
    return 1;
  return 0;
}

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

function testText (textFile, bloomfilters, callback) {
  fs.readFile(textFile, function (err, res) {
    if (err) { console.log("err2"); return callback(err) }
    try {
		// line by line
        var words = res.toString('utf8').split(/\s+/);
        console.log("Words: " + words.length);
        words = uniq(words);
		console.log("Unique: " + words.length);
        var langs = Object.keys(bloomfilters);
        var counters = {};
        for (var j=0; j < langs.length; j++) {
          counters[langs[j]] = { language: langs[j], hits: 0}
	    }
	    
	    for (var i=0; i < words.length; i++) {
	    	for (var j=0; j < langs.length; j++) {
	    		if (bloomfilters[langs[j]].test(words[i])) {
	    			counters[langs[j]].hits++;
//	    			console.log(words[i]);
	    		}
	    	}
	    }
	    // sort results by # of hits
	    var result = Object.keys(counters).map(function(key){return counters[key]}).sort(compareLangsByHitsDesc);
	    callback(null, { matches: result, totalWords: words.length });
    } catch (e) {
		console.error(e);
        return callback(err)
    }
  })
}


module.exports.testText = testText;


