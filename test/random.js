module.exports = {
  getInitialState: function() {
    return {noThanksOdds: 0, learningRate: 5}
  },
  getPredictor: function(state) {
    return {
      predict: function(gameState, legalActions) {
        if(legalActions.length === 1 || Math.random() > state.noThanksOdds / 100) {
          return 'take';
        } else {
          return 'noThanks';
        }
      }
    };
  },
  getCompetitorPredictor: function(state, index, count) {
    return {
      predict: function(gameState, legalActions) {
        if(legalActions.length === 1 || Math.random() > .95) {
          return 'take';
        } else {
          return 'noThanks';
        }
      }
    };
  },
  updateState: function(state, score, prevScore) {
    state.noThanksOdds = state.noThanksOdds + state.learningRate;
    return state;
  },
  shouldStop: function(state) {
    return state.noThanksOdds > 100;
  },
  getStateDescription: function(state) {
    return 'Random ' + state.noThanksOdds + '% NT';
  }
}