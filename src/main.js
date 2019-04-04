/*eslint-env node*/
import './main.scss';
var $ = require('jquery'); // Load jQuery as a module
require('jsrender')($);    // Load JsRender as jQuery plugin (jQuery instance as parameter)
console.log($);
console.log($.templates);

class Animal {
  constructor(args) {
    this.name = args.name || 'unnamed';
    this.age = args.age || 0;
  }
  static staticMethod() {
    console.log('this is a static method');
  }
  greet() {
    console.log(`My name is ${this.name} and age is ${this.age}`);
  }
}

class Cow extends Animal {
  constructor(args) {
    super(args);
    this.from = args.from || 'Korea';
  }
  greet() { // overrides the parent method
    console.log(`Moo~~ my name is ${this.name} and ${this.age} years old. I am from ${this.from}`);
  }
}

let unknownAnimal = new Animal({});
unknownAnimal.greet();
let cow = new Cow({age: 10, name: 'mooey'});
cow.greet();
