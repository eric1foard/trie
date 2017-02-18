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
}

let t = new Trie();
console.log(t);
console.log(t.insert('wow', 7));
console.log(JSON.stringify(t.root, null, 2));

module.exports = Trie;
