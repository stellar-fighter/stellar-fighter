const should = require('chai').should()
const sinon = require('sinon')
import {Vec} from '../src/vec';

describe('test vec.js', function() {
  before(() => {
  })
  after(() => {
  })
  beforeEach(() => {
  })
  afterEach(() => {
  })
  it('test Vec.add()', () => {
    const vec = new Vec(1, 2).add(123, 456);
    should.equal(vec.x, 124);
    should.equal(vec.y, 458);
  })
});
