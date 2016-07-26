// Generated by CoffeeScript 1.8.0
'use strict';
HTMLWidgets.widget({
  name: 'rhtmlLabeledScatter',
  type: 'output',
  resize: function(el, width, height, instance) {
    instance.resize(el, width, height);
    return instance;
  },
  initialize: function(el, width, height) {
    return new LabeledScatter(el, width, height);
  },
  renderValue: function(el, config, instance) {
    var err, errorHandler, readableError;
    try {
      if (_.isString(config)) {
        config = JSON.parse(config);
      }
    } catch (_error) {
      err = _error;
      readableError = new Error("LabeledScatter error : Cannot parse 'settingsJsonString': " + err);
      console.error(readableError);
      errorHandler = new DisplayError(el, readableError);
      errorHandler.draw();
      throw new Error(err);
    }
    delete config['width'];
    delete config['height'];
    try {
      instance.setConfig(config);
      return instance.draw();
    } catch (_error) {
      err = _error;
      console.error(err.stack);
      errorHandler = new DisplayError(el, err);
      errorHandler.draw();
      throw new Error(err);
    }
  }
});
