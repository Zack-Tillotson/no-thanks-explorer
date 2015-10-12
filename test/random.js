module.exports = function() {
  return {
    predict: function(gameState, legalActions) {
      const willTake = legalActions.length === 1 || Math.random() > .5;
      const ret = [
        {action: 'take', value: willTake ? 1 : 0},
        {action: 'noThanks', value: willTake ? 0 : 1}
      ];
      return ret;
    }
  }
}