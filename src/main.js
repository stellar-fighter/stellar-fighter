let element = document.createElement('h1');
element.innerHTML = 'hello world!';
document.body.appendChild(element);

class AAA {
  constructor(args) {
    console.log(`hello ${args}`);
  }
}

let aaa = new AAA({'a': 1, 'b': 2, 'c': 3, 'd': 4});

console.log(aaa);
