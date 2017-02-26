const expect = require('chai').expect;
const Trie = require('./../index');

const setupTrie = () => {
  let t = new Trie();
  t.insert('wow', 3);
  t.insert('vancouver', 12);
  t.insert('whales', 4);
  t.insert('whatever', 20);
  t.insert('what', 'my-cool-value');
  return t;
};

describe('when constructing a new trie', () => {
  it('should create a root node with enmpty string as key & null value', () => {
    let t = new Trie();
    expect(t.root).to.be.an('object');
    expect(t.root).to.eql({
      key: '',
      value: null,
      children: {}
    })
  });
});

describe('when inserting elements into the trie', () => {
  it('should throw an error if insert string is falsy', () => {
    let t = new Trie();
    let insertResult = t.insert(null, null);
    expect(insertResult).to.be.an('error');
  });
  it('should throw an error if insert key is not a string', () => {
    let t = new Trie();
    let insertResult = t.insert(7, 20);
    expect(insertResult).to.be.an('error');
  });
  describe('and trie is empty', () => {
    it('should correctly insert a string', () => {
      let t = new Trie();
      t.insert('wow', 7);
      expect(t).to.eql(require('./trie-states/insert-into-empty-trie')());
    });
  });
  describe('and trie is not empty', () => {
    it('should correctly insert a strings with no common prefix', () => {
      let t = new Trie();
      t.insert('wow', 7);
      t.insert('hey', 3);
      expect(t).to.eql(require('./trie-states/insert-into-non-empty-trie')());
    });
    it('should correctly insert a strings with common prefix', () => {
      let t = new Trie();
      t.insert('wow', 7);
      t.insert('whoa', 10);
      expect(t).to.eql(require('./trie-states/insert-into-non-empty-trie-shared')());
    });
    it('should correctly insert a where one string is a substring of the other', () => {
      let t = new Trie();
      t.insert('whatever', 7);
      t.insert('what', 10);
      expect(t).to.eql(require('./trie-states/insert-into-non-empty-trie-substring')());

      t = new Trie();
      t.insert('what', 10);
      t.insert('whatever', 7);
      expect(t).to.eql(require('./trie-states/insert-into-non-empty-trie-substring')());
    });
    it('should not change structure of tree if duplicate key is inserted', () => {
      let t = new Trie();
      t.insert('wow', 7);
      t.insert('wow', 7);
      expect(t).to.eql(require('./trie-states/insert-into-empty-trie')());
    });
  });
});

describe('when searching for exact matching key in the trie', () => {
  let t;
  before(() => {
    t = setupTrie();
  });
  it('should throw an error if search target is not a string', () => {
    let search = t.search(3);
    expect(search).to.be.an('error');
  });
  it('should return null if search string is empty string', () => {
    let search = t.search('');
    expect(search.value).to.be.a('null');
  });
  it('should return false if search target does not exist in tree', () => {
    let search = t.search('i-am-not-in-the-trie');
    expect(search).to.equal(false);
  });
  it('should return value if target found & target includes leaf node', () => {
    let search = t.search('vancouver');
    expect(search).to.eql({key: 'r', value: 12, children: {}});
  });
  it('should return null if target found & target DOES NOT include leaf node', () => {
    let search = t.search('what');
    expect(search).to.eql(t.root.children.w.children.h.children.a.children.t);
  });
});

describe('when searching for keys in tree by prefix', () => {
  let t;
  beforeEach(() => {
    t = setupTrie();
  });
  it('should throw an error if search target is not a string', () => {
    let searchByPrefix = t.searchByPrefix(3);
  });
  it('should return all keys in trie if search string is empty string', () => {
    let searchByPrefix = t.searchByPrefix('');
    expect(searchByPrefix.sort()).to.eql([12, 20, 3, 4, 'my-cool-value']);
  });
  it('should return false if search target does not exist in tree', () => {
    let searchByPrefix = t.searchByPrefix('banana');
    expect(searchByPrefix).to.equal(false);
  });
  describe('and search results exist', () => {
    describe('and key terminates in leaf node', () => {
      it('should return single result', () => {
        let searchByPrefix = t.searchByPrefix('vancouver');
        expect(searchByPrefix).to.be.an('array');
        expect(searchByPrefix.length).to.equal(1);
        expect(searchByPrefix[0]).to.eql({key: 'r', value: 12, children: {}});
      });
    });
    describe('and key does not terminate in leaf node', () => {
      it('should return all results in subtree when search key matches key in tree', () => {
        let searchByPrefix = t.searchByPrefix('w');
        expect(searchByPrefix.sort()).to.eql([20,3,4,'my-cool-value']);
      });
      it('should return all results in subtree when search key is not a key in the tree',() => {
        t.insert('wowee', 1);
        t.insert('wowzer', 2);
        t.insert('wowwowweewow', 4);
        let searchByPrefix = t.searchByPrefix('wow');
        expect(searchByPrefix.sort()).to.eql([1,2,3,4]);
      });
    });
  });
});

describe('when removing elements from the trie', () => {
  let t, compareTrie;
  beforeEach(() => {
    t = setupTrie();
    compareTrie = require('./trie-states/test-remove')();
  });
  it('should throw an error if removal target is not a string', () => {
    let removalResult = t.remove(3);
    expect(removalResult).to.be.an('error');
    expect(t).to.eql(compareTrie);
  });
  it('should return true if remove is called with key that does not exist in trie', () => {
    let removalResult = t.remove('I am not in the trie');
    expect(removalResult).to.equal(true);
    expect(t).to.eql(compareTrie);
  });
  it('should return false if try to remove root', () => {
    let removalResult = t.remove('');
    expect(removalResult).to.equal(false);
    expect(t).to.eql(compareTrie);
  });
  describe('and removal key exists in the trie', () => {
    describe('and key terminates in a leaf', () => {
      it('and key shares NO nodes with another key, should return true & modify tree correctly', () => {
        let removalResult = t.remove('vancouver');
        expect(removalResult).to.equal(true);
        delete compareTrie.root.children.v;
        expect(t).to.eql(compareTrie);
      });
      it('and key shares nodes with another key, should return true & modify tree correctly', () => {
        let removalResult = t.remove('whales');
        expect(removalResult).to.equal(true);
        delete compareTrie.root.children.w.children.h.children.a.children.l;
        expect(t).to.eql(compareTrie);
      });
      it('and key has another key as its prefix, should return true & modify tree correctly', () => {
        let removalResult = t.remove('whatever');
        expect(removalResult).to.equal(true);
        compareTrie.root.children.w.children.h.children.a.children.t.children = {};
        expect(t).to.eql(compareTrie);
      });
    });
    describe('and key does NOT terminate in a leaf (i.e. is prefix of another key)', () => {
      it('should return true & modify tree correctly', () => {
        let removalResult = t.remove('what');
        expect(removalResult).to.equal(true);
        compareTrie.root.children.w.children.h.children.a.children.t.value = null;
        expect(t).to.eql(compareTrie);
      });
    });
  });
});
