"use strict";

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.children = {};
  }
}

class Trie {
  constructor() {
  this.root = new Node('', null);
  }

  insert(str, value) {
    if (typeof str !== 'string') {
      return new Error(`insert key must be a string: ${str}`);
    }
    let currNode = this.root;
    let char, child, isLeaf;

    for (let i=0; i<str.length; i++) {
      char = str.charAt(i);
      child = currNode.children[char];
      isLeaf = i === str.length - 1;
      if (!child) {
        child = new Node(char, isLeaf ? value : null);
        currNode.children[char] = child;
      }
      currNode = child;
    }
    return value;
  }

  search(str) {
    if (typeof str !== 'string') {
      return new Error(`search key must be a string: ${str}`);
    }
    let currNode = this.root;
    let char, child;

    for (let i=0; i<str.length; i++) {
      char = str.charAt(i);
      child = currNode.children[char];
      if (!child) {
        return false;
      }
      currNode = child;
    }
    return currNode.value;
  }
}

let t = new Trie();
console.log(t);
t.insert('wow', 7);
t.insert('whw', 3);
t.insert('zgb', 1);
console.log(JSON.stringify(t.root, null, 2));
console.log('searching...', t.search('wow'));
console.log('searching...', t.search('hey'));
console.log('searching...', t.search('whw'));
console.log('searching...', t.search('w'));

module.exports = Trie;
