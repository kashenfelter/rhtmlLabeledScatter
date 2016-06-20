// Generated by CoffeeScript 1.8.0
var PlotData;

PlotData = (function() {
  function PlotData(X, Y) {
    this.X = X;
    this.Y = Y;
    if (this.X.length === this.Y.length) {
      this.len = X.length;
    } else {
      throw new Error("Inputs X and Y lengths do not match!");
    }
  }

  PlotData.prototype.normalizeData = function() {
    var i, threshold, _results;
    this.minX = Infinity;
    this.maxX = -Infinity;
    this.minY = Infinity;
    this.maxY = -Infinity;
    i = 0;
    while (i < this.len) {
      if (this.minX > this.X[i]) {
        this.minX = this.X[i];
      }
      if (this.maxX < this.X[i]) {
        this.maxX = this.X[i];
      }
      if (this.minY > this.Y[i]) {
        this.minY = this.Y[i];
      }
      if (this.maxY < this.Y[i]) {
        this.maxY = this.Y[i];
      }
      i++;
    }
    threshold = 0.05;
    i = 0;
    _results = [];
    while (i < this.len) {
      this.X[i] = threshold + (this.X[i] - this.minX) / (this.maxX - this.minX) * (1 - 2 * threshold);
      this.Y[i] = threshold + (this.Y[i] - this.minY) / (this.maxY - this.minY) * (1 - 2 * threshold);
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.getX = function() {
    return this.X;
  };

  PlotData.prototype.getY = function() {
    return this.Y;
  };

  PlotData.prototype.getLen = function() {
    return this.len;
  };

  PlotData.prototype.getMinX = function() {
    return this.minX;
  };

  PlotData.prototype.getMaxX = function() {
    return this.maxX;
  };

  PlotData.prototype.getMinY = function() {
    return this.minY;
  };

  PlotData.prototype.getMaxY = function() {
    return this.maxY;
  };

  return PlotData;

})();