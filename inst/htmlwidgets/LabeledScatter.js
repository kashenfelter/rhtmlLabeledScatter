// Generated by CoffeeScript 1.8.0
'use strict';
var LabeledScatter,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

LabeledScatter = (function() {
  LabeledScatter.plot = null;

  LabeledScatter.data = null;

  LabeledScatter.prototype.getResizeDelayPromise = function() {
    if (this.resizeDelayPromise == null) {
      this.resizeDelayPromise = new Promise((function(_this) {
        return function() {
          return setTimeout(function() {
            var el, height, resizeParams, svg, width;
            console.log('rhtmlLabeledScatter: resize timeout');
            resizeParams = _this.resizeStack.pop();
            el = resizeParams[0];
            width = resizeParams[1];
            height = resizeParams[2];
            _this.resizeStack = [];
            _this.width = width;
            _this.height = height;
            d3.select('.plot-container').remove();
            svg = d3.select(el).append('svg').attr('width', _this.width).attr('height', _this.height).attr('class', 'plot-container');
            _this.plot.setDim(svg, _this.width, _this.height);
            _this.plot.draw();
            return _this.resizeDelayPromise = null;
          }, 500);
        };
      })(this));
    }
    return this.resizeDelayPromise;
  };

  function LabeledScatter(width, height, stateChangedCallback) {
    this.width = width;
    this.height = height;
    this.stateChangedCallback = stateChangedCallback;
    this.resize = __bind(this.resize, this);
    this.getResizeDelayPromise = __bind(this.getResizeDelayPromise, this);
    this.resizeStack = [];
    this.resizeDelayPromise = null;
  }

  LabeledScatter.prototype.resize = function(el, width, height) {
    this.resizeStack.push([el, width, height]);
    return this.getResizeDelayPromise();
  };

  LabeledScatter.prototype.draw = function(data, el, state) {
    var svg;
    svg = d3.select(el).append('svg').attr('width', this.width).attr('height', this.height).attr('class', 'plot-container');
    if ((data.X != null) && (data.Y != null)) {
      this.data = data;
    } else {
      this.data = testData5;
    }
    console.log("rhtmlLabeledScatter: received state");
    console.log(state);
    this.plot = new RectPlot(state, this.stateChangedCallback, this.width, this.height, this.data.X, this.data.Y, this.data.Z, this.data.group, this.data.label, svg, this.data.fixedAspectRatio, this.data.xTitle, this.data.yTitle, this.data.zTitle, this.data.title, this.data.colors, this.data.transparency, this.data.grid, this.data.origin, this.data.originAlign, this.data.titleFontFamily, this.data.titleFontSize, this.data.titleFontColor, this.data.xTitleFontFamily, this.data.xTitleFontSize, this.data.xTitleFontColor, this.data.yTitleFontFamily, this.data.yTitleFontSize, this.data.yTitleFontColor, this.data.showLabels, this.data.labelsFontFamily, this.data.labelsFontSize, this.data.labelsFontColor, this.data.xDecimals, this.data.yDecimals, this.data.zDecimals, this.data.xPrefix, this.data.yPrefix, this.data.zPrefix, this.data.xSuffix, this.data.ySuffix, this.data.zSuffix, this.data.legendShow, this.data.legendBubblesShow, this.data.legendFontFamily, this.data.legendFontSize, this.data.legendFontColor, this.data.axisFontFamily, this.data.axisFontColor, this.data.axisFontSize, this.data.pointRadius, this.data.xBoundsMinimum, this.data.xBoundsMaximum, this.data.yBoundsMinimum, this.data.yBoundsMaximum, this.data.xBoundsUnitsMajor, this.data.yBoundsUnitsMajor);
    this.plot.draw();
    return this;
  };

  return LabeledScatter;

})();
