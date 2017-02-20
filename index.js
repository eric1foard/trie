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
      } else if (isLeaf) {
        child.value = value;
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

  // return true if deletion successful, false otherwise
  remove(str) {
    if (typeof str !== 'string') {
      return new Error(`remove key must be a string: ${str}`);
    }
    if (!str.length) return false;

    let currNode = this.root;
    let nodes = [];
    let char, child;

    for (let i=0; i<str.length; i++) {
      char = str.charAt(i);
      child = currNode.children[char];
      if (!child) {
        return true; // tried to remove non-existent string; successful by default
      }
      nodes.push(child);
      currNode = child;
    }

    for (let i=nodes.length-1; i>=0; i--) {
      if (Object.keys(nodes[i].children).length) {
        if (i === nodes.length-1) {
          nodes[i].value = null;
        }
        return true;
      }
      // only delete node if terminating char of removal target or empty node w/ no children
      if (i === nodes.length-1 || nodes[i].value === null) {
        char = nodes[i].key;
        delete (nodes[i-1] || this.root).children[char];
      }
    }
    return true;
  }
}

/*
let startTime = Date.now();
let t = new Trie();
for (var i = 0; i < 1000; i++) {
t.insert(Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10));
}
console.log(t);
let endTime = Date.now();
console.log(`time: ${endTime - startTime}`);
*/

module.exports = Trie;
