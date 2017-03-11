"use strict";

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.children = {};
  }
}

const _searchSubtree = (node, arr) => {
  let value, result;
  let children = Object.keys(node.children);
  if (children.length === 0) {
    return arr;
  };
  children.forEach((key) => {
    value = node.children[key].value;
    if (value !== null) {
      arr.push(value);
    }
    if (Object.keys(node.children[key].children).length) {
        return _searchSubtree(node.children[key], arr);
    }
  });
  return arr;
};

class Trie {
  constructor() {
    this.root = new Node('', null);
  }

  insert(str, value) {
    if (typeof str !== 'string') {
      return new Error(`insert key must be a string: ${str}`);
    }
    let currNode = this.root;
    let char, child, isLastChar;

    for (let i=0; i<str.length; i++) {
      char = str.charAt(i);
      child = currNode.children[char];
      isLastChar = i === str.length - 1;
      if (!child) {
        child = new Node(char, isLastChar ? value : null);
        currNode.children[char] = child;
      } else if (isLastChar) {
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
    return currNode;
  }

  searchByPrefix(str) {
    if (typeof str !== 'string') {
      return new Error(`search key must be a string: ${str}`);
    }
    let node = this.search(str);
    if (!node) {
      return false;
    }
    if (Object.keys(node.children).length === 0) {
      return [node.value];
    }
    return _searchSubtree(node, node.value === null ? [] : [node.value]);
  }

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

// this module is designed for for use in a chrome extension, so may not be run in node
if (module && module.exports) {
  module.exports = Trie;
}
