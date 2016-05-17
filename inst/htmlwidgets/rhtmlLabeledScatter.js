'use strict';
HTMLWidgets.widget({
  name: 'rhtmlLabeledScatter',
  type: 'output',
  initialize: function(el, width, height) {
    console.log('Initialized');
    console.log("Given width " + width);
    console.log("Given height " + height);
    return new LabeledScatter(width, height);
  },
  resize: function(el, width, height, instance) {
    console.log('Resized');
    instance.redraw(width, height, el);
    return instance;
  },
  renderValue: function(el, params, instance) {
    console.log('RenderValue called');
    this.data = {};
    instance.draw(this.data, el);
    return instance;
  }
});