var fs = require('fs')
var path = require('path')
var BloomFilter = require('./bloomfilter.js')

/**
 * Load the languages file
 *
 * (string, (?Error, ?Object))
 */
module.exports.loadLanguages = function (langFile, cb) {
  fs.readFile(langFile, function (err, res) {
    if (err) { return cb(err) }

    var languages
    try {
      languages = JSON.parse(res)
    } catch (e) {
      return cb(err)
    }

    return cb(null, { file: langFile, languages: languages })
  })
} 

function loadDictionary (dictFile, cb) {

  fs.readFile(dictFile, function (err, res) {
    if (err) {   console.log("err1"); return cb(err) }

    try {
		// line by line
	    var lines = res.toString('utf8').split('\n');
    } catch (e) {
      return cb(err)
    }

    return cb(null, { file: dictFile, words: lines })
  })
}

/**
 * Load the dictionary
 *
 * (string, (?Error, ?Object))
 */
module.exports.loadDictionary = loadDictionary;

module.exports.buildBloomFilterForLanguage = function (langID, fileDict, bloomfilters, falsePositiveP) {
  loadDictionary (fileDict, function (err, dictionary) {
    var bf = new BloomFilter(dictionary.words.length, falsePositiveP);
    for (var wi = 0; wi < dictionary.words.length; wi++) {
      bf.add(dictionary.words[wi]);
    }
  
    console.log("aback: " + bf.test('aback'));
    console.log("aback1231n23: " + bf.test('aback12312b3'));
	var cnt = 0;
	for (var i = 0; i< bf.m; i++) {
		if (bf.bitset[i] ) cnt++;
	}
    console.log ("Ocupacion: " + cnt + "/" + bf.m);

    bloomfilters[langID] = bf;
    
  });

}






