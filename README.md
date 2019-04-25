Language Detector
=================

This project was written with a single goal: show Bloom Filters in action.

It is a Node application that creates a Bloom Filter for each language. Dictionaries were taken from [gwicks.net](http://www.gwicks.net/dictionaries.htm) but you can load more dictionaries simply setting src/languages.json.

Then it is able to test every word of a text file agains every bloomfilter. Providing a false positive rate low enough (i.e. 0.0000001) it determines quite good the similarity of the input text to each language.

## Usage

To run the Language Detector invoke index.js passing as arguments the text to be analized and a false positive probability

In example

```bash 
$ node src/index.js texts/spanish.txt 0.0000001
```
## Improvements

As I've commented out below above the purpose of this project is not language detection itself but bloom filter demonstration. However anyone reading this lines is invited to improve and extend the project. Here are some thoughts:

* Better tokenization
* Consolidate multiple dictionaries for the same language




