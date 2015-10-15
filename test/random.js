module.exports = function() {
  return {
    predict: function(gameState, actions) {
      const ret = [];
      for(var i = 0 ; i < actions.length ; i++) {
        var action = actions[i];
        switch(action) {
          case 'take':
            ret.push({action: action, value: .5});
            break;
          case 'noThanks':
            ret.push({action: action, value: Math.random() > .66 ? 0 : 1});
            break;
        }
      };

      ret.sort(function(a,b) { return b.value - a.value});

      return ret;
    }
  }
}