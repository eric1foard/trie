const Trie = require('../../index');

const _randString = (count) => {
  count = count || 1;
  let result = '';
  while(count) {
    result += Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10);
    count--;
  }
  return result;
};


let startTime = Date.now();
let t = new Trie();
for (var i = 0; i < 100; i++) {
t.insert(_randString(3), Math.floor(Math.random() * 1000));
}
let result = t.searchByPrefix('a');
let endTime = Date.now();
console.log(`time: ${endTime - startTime}`);
