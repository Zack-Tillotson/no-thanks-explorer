module.exports = function() {
  return {
    predict: function(gameState, legalActions) {
      if(legalActions.length === 1 || Math.random() > .5) {
        return 'take';
      } else {
        return 'noThanks';
      }
    }
  }
}