const should = require('chai').should()
const sinon = require('sinon')
import {Vec} from '../src/vec';

describe('test vec.js', function() {
  before(() => {
  });
  after(() => {
  });
  beforeEach(() => {
  });
  afterEach(() => {
  });
  it('test Vec.addCo()', () => {
    const vec = new Vec(1, 2).addCo(123, 456);
    should.equal(vec.x, 124);
    should.equal(vec.y, 458);
  });
  it('test Vec.add()', () => {
    const vec = new Vec(1, 2).add(123, 456);
    should.equal(vec.x, 124);
    should.equal(vec.y, 458);
  });
  it('test Vec.addVec()', () => {
    const vec = new Vec(1, 2).addVec(new Vec(123, 456));
    should.equal(vec.x, 124);
    should.equal(vec.y, 458);
  });
});
