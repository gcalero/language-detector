var fs = require('fs')
var path = require('path')
var BitArray = require('./BitArray.js')
var sha = require('./sha256.js')
var sha1 = require('./sha1.js')

var BloomFilter = (function (Object, Array, Date, module) {

  const DEFAULT_FALSE_POSITIVE_RATE = 0.001;

  function getPositionsForElement(e) {
    //	Apply the Kirsch-Mitzenmacher-Optimization to only compute 2 instead of k hash functions 
    var hash1 = parseInt(this.hash_f1(e), 16);
	var hash2 = parseInt(this.hash_f2(e), 16);
	var hashPositions = new Array(this.k);	
	for (var i=0; i< this.k; i++) {
		var hash_i = hash1 + i * hash2;
		hashPositions[i] = hash_i % this.m;
	}
	
	return hashPositions;
  }
  
  function addElement(e) {
  	var hashPositions = this.getPositionsForElement(e);

	for (var i=0; i< this.k; i++) {
		var pos = hashPositions[i];
		this.bitset[pos] = 1;
	}
  }
  
  function testElement(e) {
    var hashPositions = this.getPositionsForElement(e);

	for (var i=0; i< this.k; i++) {
      var pos = hashPositions[i];
	  if (this.bitset[pos] != 1) {
		  return false;
	  }
    }
	return true; // may be false-positive
  }
  
  function optimalM(n, p) {
    return Math.ceil(-1 * (n * Math.log2(p)));
  }

  function optimalK(m, n) {
    return Math.ceil((m / n) * Math.log(2));
  }
  
  /**
  * @class BitArray
  *
  * @constructor
  * @param n: amount of elements to be added
  * @param [p]: false positive rate. Default DEFAULT_FALSE_POSITIVE_RATE
  */
  function BloomFilter(n, p)
  {
    p = p || DEFAULT_FALSE_POSITIVE_RATE;
    var m = optimalM(n, p);	
  	var k =  optimalK(m,n);
  	var bloomFilter = new Object()
  	bloomFilter.constructor = BloomFilter // Replace contructor
  	bloomFilter.bitset = new BitArray();
    bloomFilter.bitset.length = m;
	bloomFilter.m = m;
	bloomFilter.k =	k;
  	bloomFilter.add = addElement;
  	bloomFilter.test = testElement;
	bloomFilter.hash_f1 = sha.sha256;
	bloomFilter.hash_f2 = sha1;

  	bloomFilter.getPositionsForElement= getPositionsForElement;
	
//	console.log('BloomFilter (n:'+ n + ', p:' + p + ', m:' + m + ', k: ' + k + ')');

  	return bloomFilter;
  }
  
  if (module)
  {
    module.exports = BloomFilter;
  }
  else
  {
    return BloomFilter;	
  }

})(Object, Array, Date, (module && module.exports) ? module : null);
