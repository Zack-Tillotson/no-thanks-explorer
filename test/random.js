module.exports = function() {
  return {
    predict: function(gameState, actionOptions) {
      for(var i = 0 ; i < actionOptions.length ; i++) {
        var option = actionOptions[i];
        switch(option.action) {
          case 'take':
            option.value = 1;
            break;
          case 'noThanks':
            option.value = Math.random() > .5 ? 0 : 2;
            break;
        }
      };
      return actionOptions;
    }
  }
}