// Generated by CoffeeScript 1.8.0
'use strict';
var PlotData,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

PlotData = (function() {
  function PlotData(X, Y, Z, group, label, labelAlt, viewBoxDim, legendDim, colorWheel, fixedAspectRatio, originAlign, pointRadius, bounds, transparency, legendShow, legendBubblesShow, axisDimensionText) {
    this.X = X;
    this.Y = Y;
    this.Z = Z;
    this.group = group;
    this.label = label;
    this.labelAlt = labelAlt;
    this.viewBoxDim = viewBoxDim;
    this.legendDim = legendDim;
    this.colorWheel = colorWheel;
    this.fixedAspectRatio = fixedAspectRatio;
    this.originAlign = originAlign;
    this.pointRadius = pointRadius;
    this.bounds = bounds;
    this.transparency = transparency;
    this.legendShow = legendShow;
    this.legendBubblesShow = legendBubblesShow;
    this.axisDimensionText = axisDimensionText;
    this.removeElemFromLegend = __bind(this.removeElemFromLegend, this);
    this.addElemToLegend = __bind(this.addElemToLegend, this);
    this.isLegendPtOutsideViewBox = __bind(this.isLegendPtOutsideViewBox, this);
    this.isOutsideViewBox = __bind(this.isOutsideViewBox, this);
    this.resizedAfterLegendGroupsDrawn = __bind(this.resizedAfterLegendGroupsDrawn, this);
    this.setupLegendGroupsAndPts = __bind(this.setupLegendGroupsAndPts, this);
    this.setLegendItemsPositions = __bind(this.setLegendItemsPositions, this);
    this.getPtsAndLabs = __bind(this.getPtsAndLabs, this);
    this.normalizeZData = __bind(this.normalizeZData, this);
    this.normalizeData = __bind(this.normalizeData, this);
    this.calculateMinMax = __bind(this.calculateMinMax, this);
    this.revertMinMax = __bind(this.revertMinMax, this);
    this.origX = this.X.slice(0);
    this.origY = this.Y.slice(0);
    this.normX = this.X.slice(0);
    this.normY = this.Y.slice(0);
    if (Utils.isArrOfNums(this.Z) && this.Z.length === this.X.length) {
      this.normZ = this.Z.slice();
    }
    this.outsidePlotPtsId = [];
    this.legendPts = [];
    this.outsidePlotCondensedPts = [];
    this.legendBubbles = [];
    this.legendBubblesLab = [];
    this.legendRequiresRedraw = false;
    if (this.X.length === this.Y.length) {
      this.len = this.origLen = X.length;
      this.normalizeData();
      if (Utils.isArrOfNums(this.Z)) {
        this.normalizeZData();
      }
      this.plotColors = new PlotColors(this);
      this.labelNew = new PlotLabel(this.label, this.labelAlt, this.viewBoxDim.labelLogoScale);
    } else {
      throw new Error("Inputs X and Y lengths do not match!");
    }
  }

  PlotData.prototype.revertMinMax = function() {
    this.minX = this.minXold;
    this.maxX = this.maxXold;
    this.minY = this.minYold;
    return this.maxY = this.maxYold;
  };

  PlotData.prototype.calculateMinMax = function() {
    var notMovedX, notMovedY, ptsOut, rangeAR, rangeToWidgetARRatio, rangeX, rangeY, thres, widgetAR, xThres, yThres;
    this.minXold = this.minX;
    this.maxXold = this.maxX;
    this.minYold = this.minY;
    this.maxYold = this.maxY;
    ptsOut = this.outsidePlotPtsId;
    notMovedX = _.filter(this.origX, function(val, key) {
      return !(_.includes(ptsOut, key));
    });
    notMovedY = _.filter(this.origY, function(val, key) {
      return !(_.includes(ptsOut, key));
    });
    this.minX = _.min(notMovedX);
    this.maxX = _.max(notMovedX);
    this.minY = _.min(notMovedY);
    this.maxY = _.max(notMovedY);
    rangeX = this.maxX - this.minX;
    rangeY = this.maxY - this.minY;
    thres = 0.08;
    xThres = thres * rangeX;
    yThres = thres * rangeY;
    if (xThres === 0) {
      xThres = 1;
    }
    if (yThres === 0) {
      yThres = 1;
    }
    this.maxX += xThres;
    this.minX -= xThres;
    this.maxY += yThres;
    this.minY -= yThres;
    if (this.originAlign) {
      this.maxX = this.maxX < 0 ? 0 : this.maxX + xThres;
      this.minX = this.minX > 0 ? 0 : this.minX - xThres;
      this.maxY = this.maxY < 0 ? 0 : this.maxY + yThres;
      this.minY = this.minY > 0 ? 0 : this.minY - yThres;
    }
    if (this.fixedAspectRatio) {
      rangeX = this.maxX - this.minX;
      rangeY = this.maxY - this.minY;
      rangeAR = Math.abs(rangeX / rangeY);
      widgetAR = this.viewBoxDim.width / this.viewBoxDim.height;
      rangeToWidgetARRatio = widgetAR / rangeAR;
      if (widgetAR >= 1) {
        if (rangeX > rangeY) {
          if (rangeToWidgetARRatio > 1) {
            this.maxX += (widgetAR * rangeY - rangeX) / 2;
            this.minX -= (widgetAR * rangeY - rangeX) / 2;
          } else {
            this.maxY += ((1 / widgetAR) * rangeX - rangeY) / 2;
            this.minY -= ((1 / widgetAR) * rangeX - rangeY) / 2;
          }
        } else if (rangeX < rangeY) {
          this.maxX += ((widgetAR * rangeY) - rangeX) / 2;
          this.minX -= ((widgetAR * rangeY) - rangeX) / 2;
        }
      } else {
        if (rangeX < rangeY) {
          if (rangeToWidgetARRatio < 1) {
            this.maxY += (1 / widgetAR * rangeX - rangeY) / 2;
            this.minY -= (1 / widgetAR * rangeX - rangeY) / 2;
          } else {
            this.maxX += (widgetAR * rangeY - rangeX) / 2;
            this.minX -= (widgetAR * rangeY - rangeX) / 2;
          }
        } else if (rangeX > rangeY) {
          this.maxY += ((1 / widgetAR) * rangeX - rangeY) / 2;
          this.minY -= ((1 / widgetAR) * rangeX - rangeY) / 2;
        }
      }
    }
    if (Utils.isNum(this.bounds.xmax)) {
      this.maxX = this.bounds.xmax;
    }
    if (Utils.isNum(this.bounds.xmin)) {
      this.minX = this.bounds.xmin;
    }
    if (Utils.isNum(this.bounds.ymax)) {
      this.maxY = this.bounds.ymax;
    }
    if (Utils.isNum(this.bounds.ymin)) {
      return this.minY = this.bounds.ymin;
    }
  };

  PlotData.prototype.normalizeData = function() {
    var condensedPtsDataIdArray, draggedNormX, draggedNormY, i, id, lp, markerTextX, markerTextY, newMarkerId, numDigitsInId, x1, x2, y1, y2, _i, _len, _ref, _results;
    this.calculateMinMax();
    this.outsidePlotMarkers = [];
    this.outsidePlotMarkersIter = 0;
    _ref = this.legendPts;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      lp = _ref[_i];
      id = lp.pt.id;
      draggedNormX = (this.X[id] - this.minX) / (this.maxX - this.minX);
      draggedNormY = (this.Y[id] - this.minY) / (this.maxY - this.minY);
      newMarkerId = this.outsidePlotMarkersIter;
      lp.markerId = newMarkerId;
      if (Math.abs(draggedNormX) > 1 || Math.abs(draggedNormY) > 1 || draggedNormX < 0 || draggedNormY < 0) {
        draggedNormX = draggedNormX > 1 ? 1 : draggedNormX;
        draggedNormX = draggedNormX < 0 ? 0 : draggedNormX;
        draggedNormY = draggedNormY > 1 ? 1 : draggedNormY;
        draggedNormY = draggedNormY < 0 ? 0 : draggedNormY;
        x2 = draggedNormX * this.viewBoxDim.width + this.viewBoxDim.x;
        y2 = (1 - draggedNormY) * this.viewBoxDim.height + this.viewBoxDim.y;
        markerTextX = markerTextY = 0;
        numDigitsInId = Math.ceil(Math.log(newMarkerId + 1.1) / Math.LN10);
        if (draggedNormX === 1) {
          x1 = x2 + this.legendDim.markerLen;
          y1 = y2;
          markerTextX = x1;
          markerTextY = y1 + this.legendDim.markerTextSize / 2;
        } else if (draggedNormX === 0) {
          x1 = x2 - this.legendDim.markerLen;
          y1 = y2;
          markerTextX = x1 - this.legendDim.markerCharWidth * (numDigitsInId + 1);
          markerTextY = y1 + this.legendDim.markerTextSize / 2;
        } else if (draggedNormY === 1) {
          x1 = x2;
          y1 = y2 + -draggedNormY * this.legendDim.markerLen;
          markerTextX = x1 - this.legendDim.markerCharWidth * numDigitsInId;
          markerTextY = y1;
        } else if (draggedNormY === 0) {
          x1 = x2;
          y1 = y2 + this.legendDim.markerLen;
          markerTextX = x1 - this.legendDim.markerCharWidth * numDigitsInId;
          markerTextY = y1 + this.legendDim.markerTextSize;
        }
        this.outsidePlotMarkers.push({
          markerLabel: newMarkerId + 1,
          ptId: id,
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          markerTextX: markerTextX,
          markerTextY: markerTextY,
          width: this.legendDim.markerWidth,
          color: lp.color
        });
        this.outsidePlotCondensedPts = _.filter(this.outsidePlotCondensedPts, function(e) {
          return e.dataId !== id;
        });
        this.len = this.origLen - this.outsidePlotMarkers.length;
      } else {
        console.log("rhtmlLabeledScatter: Condensed point added");
        condensedPtsDataIdArray = _.map(this.outsidePlotCondensedPts, function(e) {
          return e.dataId;
        });
        if (!_.includes(condensedPtsDataIdArray, id)) {
          this.outsidePlotCondensedPts.push({
            dataId: id,
            markerId: newMarkerId
          });
        }
      }
      this.outsidePlotMarkersIter++;
    }
    this.outsideBoundsPtsId = [];
    if (_.some(this.bounds, function(b) {
      return Utils.isNum(b);
    })) {
      i = 0;
      while (i < this.origLen) {
        if (!_.includes(this.outsideBoundsPtsId, i)) {
          if (this.X[i] < this.minX || this.X[i] > this.maxX || this.Y[i] < this.minY || this.Y[i] > this.maxY) {
            this.outsideBoundsPtsId.push(i);
          }
        }
        i++;
      }
    }
    i = 0;
    _results = [];
    while (i < this.origLen) {
      this.normX[i] = this.minX === this.maxX ? this.minX : (this.X[i] - this.minX) / (this.maxX - this.minX);
      this.normY[i] = this.minY === this.maxY ? this.minX : (this.Y[i] - this.minY) / (this.maxY - this.minY);
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.normalizeZData = function() {
    var legendUtils, maxZ;
    legendUtils = LegendUtils;
    maxZ = _.max(this.Z);
    legendUtils.calcZQuartiles(this, maxZ);
    return legendUtils.normalizeZValues(this, maxZ);
  };

  PlotData.prototype.getPtsAndLabs = function(calleeName) {
    console.log("getPtsAndLabs(" + calleeName + ")");
    return Promise.all(this.labelNew.getLabels()).then((function(_this) {
      return function(resolvedLabels) {
        var fillOpacity, fontColor, fontSize, group, height, i, label, labelAlt, labelZ, legendUtils, p, pt, ptColor, r, url, width, x, y, _i, _len, _ref, _ref1, _results;
        _this.pts = [];
        _this.lab = [];
        i = 0;
        while (i < _this.origLen) {
          if ((!_.includes(_this.outsidePlotPtsId, i)) || _.includes(_.map(_this.outsidePlotCondensedPts, function(e) {
            return e.dataId;
          }), i)) {
            x = _this.normX[i] * _this.viewBoxDim.width + _this.viewBoxDim.x;
            y = (1 - _this.normY[i]) * _this.viewBoxDim.height + _this.viewBoxDim.y;
            r = _this.pointRadius;
            if (Utils.isArrOfNums(_this.Z)) {
              legendUtils = LegendUtils;
              r = legendUtils.normalizedZtoRadius(_this.viewBoxDim, _this.normZ[i]);
            }
            fillOpacity = _this.plotColors.getFillOpacity(_this.transparency);
            label = resolvedLabels[i].label;
            labelAlt = ((_ref = _this.labelAlt) != null ? _ref[i] : void 0) != null ? _this.labelAlt[i] : '';
            width = resolvedLabels[i].width;
            height = resolvedLabels[i].height;
            url = resolvedLabels[i].url;
            labelZ = Utils.isArrOfNums(_this.Z) ? _this.Z[i].toString() : '';
            fontSize = _this.viewBoxDim.labelFontSize;
            if (_.includes(_.map(_this.outsidePlotCondensedPts, function(e) {
              return e.dataId;
            }), i)) {
              pt = _.find(_this.outsidePlotCondensedPts, function(e) {
                return e.dataId === i;
              });
              label = pt.markerId + 1;
              fontSize = _this.viewBoxDim.labelSmallFontSize;
              url = '';
              width = null;
              height = null;
            }
            fontColor = ptColor = _this.plotColors.getColor(i);
            if ((_this.viewBoxDim.labelFontColor != null) && !(_this.viewBoxDim.labelFontColor === '')) {
              fontColor = _this.viewBoxDim.labelFontColor;
            }
            group = _this.group != null ? _this.group[i] : '';
            _this.pts.push({
              x: x,
              y: y,
              r: r,
              label: label,
              labelAlt: labelAlt,
              labelX: _this.origX[i].toPrecision(3).toString(),
              labelY: _this.origY[i].toPrecision(3).toString(),
              labelZ: labelZ,
              group: group,
              color: ptColor,
              id: i,
              fillOpacity: fillOpacity
            });
            _this.lab.push({
              x: x,
              y: y,
              color: fontColor,
              id: i,
              fontSize: fontSize,
              fontFamily: _this.viewBoxDim.labelFontFamily,
              text: label,
              width: width,
              height: height,
              url: url
            });
          }
          i++;
        }
        _ref1 = _this.outsideBoundsPtsId;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          p = _ref1[_i];
          if (!_.includes(_this.outsidePlotPtsId, p)) {
            _results.push(_this.addElemToLegend(p));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
    })(this))["catch"](function(err) {
      return console.log(err);
    });
  };

  PlotData.prototype.setLegendItemsPositions = function(numItems, itemsArray, cols) {
    var bubbleLegendTextHeight, colSpacing, currentCol, exceededCurrentCol, i, legendStartY, legendUtils, li, numElemsInCol, numItemsInPrevCols, plottedEvenBalanceOfItemsBtwnCols, startOfCenteredLegendItems, startOfViewBox, totalItemsSpacingExceedLegendArea, _results;
    bubbleLegendTextHeight = 20;
    this.legendHeight = this.viewBoxDim.height;
    if ((this.legendBubblesTitle != null) && this.legendBubblesShow) {
      this.legendHeight = this.legendBubblesTitle[0].y - bubbleLegendTextHeight - this.viewBoxDim.y;
    }
    if (this.Zquartiles != null) {
      legendUtils = LegendUtils;
      legendUtils.setupBubbles(this);
    }
    startOfCenteredLegendItems = this.viewBoxDim.y + this.legendHeight / 2 - this.legendDim.heightOfRow * (numItems / cols) / 2 + this.legendDim.ptRadius;
    startOfViewBox = this.viewBoxDim.y + this.legendDim.ptRadius;
    legendStartY = Math.max(startOfCenteredLegendItems, startOfViewBox);
    colSpacing = 0;
    numItemsInPrevCols = 0;
    i = 0;
    currentCol = 1;
    _results = [];
    while (i < numItems) {
      if (cols > 1) {
        numElemsInCol = numItems / cols;
        exceededCurrentCol = legendStartY + (i - numItemsInPrevCols) * this.legendDim.heightOfRow > this.viewBoxDim.y + this.legendHeight;
        plottedEvenBalanceOfItemsBtwnCols = i >= numElemsInCol * currentCol;
        if (exceededCurrentCol || plottedEvenBalanceOfItemsBtwnCols) {
          colSpacing = (this.legendDim.colSpace + this.legendDim.ptRadius * 2 + this.legendDim.ptToTextSpace) * currentCol;
          numItemsInPrevCols = i;
          currentCol++;
        }
        totalItemsSpacingExceedLegendArea = legendStartY + (i - numItemsInPrevCols) * this.legendDim.heightOfRow > this.viewBoxDim.y + this.legendHeight;
        if (totalItemsSpacingExceedLegendArea) {
          break;
        }
      }
      li = itemsArray[i];
      if (li.isDraggedPt) {
        li.x = this.legendDim.x + this.legendDim.leftPadding + colSpacing;
        li.y = legendStartY + (i - numItemsInPrevCols) * this.legendDim.heightOfRow + this.legendDim.vertPtPadding;
      } else {
        li.cx = this.legendDim.x + this.legendDim.leftPadding + colSpacing + li.r;
        li.cy = legendStartY + (i - numItemsInPrevCols) * this.legendDim.heightOfRow;
        li.x = li.cx + this.legendDim.ptToTextSpace;
        li.y = li.cy + li.r;
      }
      _results.push(i++);
    }
    return _results;
  };

  PlotData.prototype.setupLegendGroupsAndPts = function() {
    var i, j, legendItemArray, totalLegendItems;
    if (this.legendPts.length > 0 && this.legendShow === true) {
      totalLegendItems = this.legendGroups.length + this.legendPts.length;
      legendItemArray = [];
      i = 0;
      j = 0;
      while (i < totalLegendItems) {
        if (i < this.legendGroups.length) {
          legendItemArray.push(this.legendGroups[i]);
        } else {
          j = i - this.legendGroups.length;
          legendItemArray.push(this.legendPts[j]);
        }
        i++;
      }
      return this.setLegendItemsPositions(totalLegendItems, legendItemArray, this.legendDim.cols);
    } else if (this.legendPts.length > 0 && this.legendShow === false) {
      return this.setLegendItemsPositions(this.legendPts.length, this.legendPts, this.legendDim.cols);
    } else {
      return this.setLegendItemsPositions(this.legendGroups.length, this.legendGroups, this.legendDim.cols);
    }
  };

  PlotData.prototype.resizedAfterLegendGroupsDrawn = function() {
    var bubbleLeftRightPadding, bubbleTitleWidth, initWidth, legendGrpsTextMax, legendPtsTextMax, maxTextWidth, spacingAroundMaxTextWidth, totalLegendItems, _ref;
    initWidth = this.viewBoxDim.width;
    totalLegendItems = this.legendShow ? this.legendGroups.length + this.legendPts.length : this.legendPts.length;
    legendGrpsTextMax = this.legendGroups.length > 0 && this.legendShow ? (_.maxBy(this.legendGroups, function(e) {
      return e.width;
    })).width : 0;
    legendPtsTextMax = this.legendPts.length > 0 ? (_.maxBy(this.legendPts, function(e) {
      return e.width;
    })).width : 0;
    maxTextWidth = _.max([legendGrpsTextMax, legendPtsTextMax]);
    spacingAroundMaxTextWidth = this.legendDim.leftPadding + this.legendDim.ptRadius * 2 + this.legendDim.rightPadding + this.legendDim.ptToTextSpace;
    bubbleLeftRightPadding = this.legendDim.leftPadding + this.legendDim.rightPadding;
    this.legendDim.cols = Math.ceil(totalLegendItems * this.legendDim.heightOfRow / this.legendHeight);
    this.legendDim.width = maxTextWidth * this.legendDim.cols + spacingAroundMaxTextWidth + this.legendDim.centerPadding * (this.legendDim.cols - 1);
    bubbleTitleWidth = (_ref = this.legendBubblesTitle) != null ? _ref[0].width : void 0;
    this.legendDim.width = _.max([this.legendDim.width, bubbleTitleWidth + bubbleLeftRightPadding, this.legendBubblesMaxWidth + bubbleLeftRightPadding]);
    this.legendDim.colSpace = maxTextWidth;
    this.viewBoxDim.width = this.viewBoxDim.svgWidth - this.legendDim.width - this.viewBoxDim.x - this.axisDimensionText.rowMaxWidth;
    this.legendDim.x = this.viewBoxDim.x + this.viewBoxDim.width;
    return initWidth !== this.viewBoxDim.width;
  };

  PlotData.prototype.isOutsideViewBox = function(lab) {
    var bot, left, right, top;
    left = lab.x - lab.width / 2;
    right = lab.x + lab.width / 2;
    top = lab.y - lab.height;
    bot = lab.y;
    if (left < this.viewBoxDim.x || right > this.viewBoxDim.x + this.viewBoxDim.width || top < this.viewBoxDim.y || bot > this.viewBoxDim.y + this.viewBoxDim.height) {
      return true;
    }
    return false;
  };

  PlotData.prototype.isLegendPtOutsideViewBox = function(lab) {
    var bot, left, right, top;
    left = lab.x;
    right = lab.x + lab.width;
    top = lab.y - lab.height;
    bot = lab.y;
    if (left < this.viewBoxDim.x || right > this.viewBoxDim.x + this.viewBoxDim.width || top < this.viewBoxDim.y || bot > this.viewBoxDim.y + this.viewBoxDim.height) {
      return true;
    }
    return false;
  };

  PlotData.prototype.addElemToLegend = function(id) {
    var checkId, movedLab, movedPt;
    checkId = function(e) {
      return e.id === id;
    };
    movedPt = _.remove(this.pts, checkId);
    movedLab = _.remove(this.lab, checkId);
    this.legendPts.push({
      id: id,
      pt: movedPt[0],
      lab: movedLab[0],
      anchor: 'start',
      text: movedLab[0].text + ' (' + movedPt[0].labelX + ', ' + movedPt[0].labelY + ')',
      color: movedPt[0].color,
      isDraggedPt: true
    });
    this.outsidePlotPtsId.push(id);
    this.normalizeData();
    this.getPtsAndLabs('PlotData.addElemToLegend');
    this.setupLegendGroupsAndPts();
    return this.legendRequiresRedraw = true;
  };

  PlotData.prototype.removeElemFromLegend = function(id) {
    var checkId, legendPt;
    checkId = function(e) {
      return e.id === id;
    };
    legendPt = _.remove(this.legendPts, checkId);
    this.pts.push(legendPt.pt);
    this.lab.push(legendPt.lab);
    _.remove(this.outsidePlotPtsId, function(i) {
      return i === id;
    });
    _.remove(this.outsidePlotCondensedPts, function(i) {
      return i.dataId === id;
    });
    this.normalizeData();
    this.getPtsAndLabs('PlotData.removeElemFromLegend');
    return this.setupLegendGroupsAndPts();
  };

  return PlotData;

})();
