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
        return false;
      }
      nodes.push(child);
      currNode = child;
    }

    for (let i=nodes.length-1; i>=0; i--) {
      if (Object.keys(nodes[i].children).length) {
        // will return false on first iteration (nothing could be deleted), else true
        return i !== nodes.length-1;
      }
      console.log('deleting node');
      char = nodes[i].key;
      delete (nodes[i-1] || this.root).children[char];
    }
    return true;
  }
}

module.exports = Trie;
