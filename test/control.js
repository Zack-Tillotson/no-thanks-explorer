import assert from 'assert';
//import Engine from '../src/index.js';

describe('Engine', function() {
  describe('getInitialState()', function () {
    it('should return an object with the correct attributes', function () {
      const state = {};//Engine.getInitialState();
      console.log('state!', state);
      assert.equal(typeof state, "object");
      assert.equal(typeof state.table, "object");
      assert.equal(typeof state.players, "object");
      assert.equal(typeof state.deck, "object");
    });
  });
});