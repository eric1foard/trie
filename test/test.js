const expect = require('chai').expect;
const Trie = require('./../index');

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
      // console.log(JSON.stringify(t, null, 2));
      expect(t).to.eql(require('./trie-states/insert-into-non-empty-trie')());
    });
  });
});
/*
describe('when searching for elements in the trie', () => {
it('should throw an error if search target is not a string', () => {

});
it('should return null if search string is empty string', () => {

});
it('should return false if search target does not exist in tree', () => {

});
it('should return value at if target found & target includes leaf node', () => {

});
it('should return null at if target found & target DOES NOT include leaf node', () => {

});
});

describe('when removing elements from the trie', () => {
it('should throw an error if removal target is not a string', () => {

});
});
*/
