module.exports = function() {
  return {
    predict: function(gameState, legalActions) {
      const willTake = legalActions.length === 1 || Math.random() > .5;
      const ret = [
        {action: 'take', value: 1},
        {action: 'noThanks', value: willTake ? 0 : 2}
      ];
      return ret;
    }
  }
}