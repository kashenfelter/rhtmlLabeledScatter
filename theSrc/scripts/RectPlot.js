
import _ from 'lodash'
import d3 from 'd3'
import md5 from 'md5'
import autoBind from 'es6-autobind'
import Links from './Links'
import PlotData from './PlotData'
import TrendLine from './TrendLine'
import AxisUtils from './utils/AxisUtils'
import DragUtils from './utils/DragUtils'
import SvgUtils from './utils/SvgUtils'
import Utils from './utils/Utils'
import TooltipUtils from './utils/TooltipUtils'
import LabelPlacement from './LabelPlacement'
import LegendSettings from './LegendSettings'
import Legend from './Legend'

class RectPlot {
  constructor (state,
    width,
    height,
    X,
    Y,
    Z,
    group,
    label,
    labelAlt = [],
    svg,
    fixedRatio,
    xTitle,
    yTitle,
    zTitle = '',
    title,
    colors,
    transparency,
    grid,
    origin,
    originAlign,
    titleFontFamily,
    titleFontSize,
    titleFontColor,
    xTitleFontFamily,
    xTitleFontSize,
    xTitleFontColor,
    yTitleFontFamily,
    yTitleFontSize,
    yTitleFontColor,
    showLabels = true,
    labelsFontFamily,
    labelsFontSize,
    labelsFontColor,
    labelsLogoScale = [],
    xDecimals = null,
    yDecimals = null,
    zDecimals = null,
    xPrefix = '',
    yPrefix = '',
    zPrefix = '',
    xSuffix = '',
    ySuffix = '',
    zSuffix = '',
    legendShow = true,
    legendBubblesShow = true,
    legendFontFamily,
    legendFontSize,
    legendFontColor,
    showXAxis = true,
    showYAxis = true,
    axisFontFamily,
    axisFontColor,
    axisFontSize,
    pointRadius = 2,
    xBoundsMinimum = null,
    xBoundsMaximum = null,
    yBoundsMinimum = null,
    yBoundsMaximum = null,
    xBoundsUnitsMajor = null,
    yBoundsUnitsMajor = null,
    trendLines = false,
    trendLinesLineThickness = 1,
    trendLinesPointSize = 2,
    plotBorderShow = true,
    plotBorderColor = 'black',
    plotBorderWidth = 1
  ) {
    autoBind(this)
    this.state = state
    this.width = width
    this.height = height
    this.X = X
    this.Y = Y
    this.Z = Z
    this.group = group
    this.label = label
    this.labelAlt = labelAlt
    this.svg = svg
    this.zTitle = zTitle
    this.colors = colors
    this.transparency = transparency
    this.originAlign = originAlign
    this.showLabels = showLabels
    this.xDecimals = xDecimals
    this.yDecimals = yDecimals
    this.zDecimals = zDecimals
    this.xPrefix = xPrefix
    this.yPrefix = yPrefix
    this.zPrefix = zPrefix
    this.xSuffix = xSuffix
    this.ySuffix = ySuffix
    this.zSuffix = zSuffix
    this.pointRadius = pointRadius
    this.xBoundsUnitsMajor = xBoundsUnitsMajor
    this.yBoundsUnitsMajor = yBoundsUnitsMajor
    this.plotBorder = {
      show: plotBorderShow,
      color: plotBorderColor,
      width: parseInt(plotBorderWidth) + 'px'
    }
    this.maxDrawFailureCount = 200

    this.axisSettings = {
      fontFamily: axisFontFamily,
      fontSize: axisFontSize,
      fontColor: axisFontColor,
      showX: showXAxis,
      showY: showYAxis
    }

    this.labelsFont = {
      size: labelsFontSize,
      color: labelsFontColor,
      family: labelsFontFamily,
      logoScale: labelsLogoScale
    }

    this.xTitle = {
      text: xTitle,
      textHeight: xTitleFontSize,
      fontFamily: xTitleFontFamily,
      fontSize: xTitleFontSize,
      fontColor: xTitleFontColor,
      topPadding: 5
    }

    this.legendSettings = new LegendSettings(legendShow, legendBubblesShow,
      legendFontFamily, legendFontSize, legendFontColor)

    if (this.xTitle.text === '') { this.xTitle.textHeight = 0 }

    this.yTitle = {
      text: yTitle,
      textHeight: yTitleFontSize,
      fontFamily: yTitleFontFamily,
      fontSize: yTitleFontSize,
      fontColor: yTitleFontColor
    }
    if (this.yTitle.text === '') { this.yTitle.textHeight = 0 }

    this.trendLines = {
      show: trendLines,
      lineThickness: trendLinesLineThickness,
      pointSize: trendLinesPointSize
    }

    this.axisLeaderLineLength = 5
    this.axisDimensionText = {
      rowMaxWidth: 0,
      rowMaxHeight: 0,
      colMaxWidth: 0,
      colMaxHeight: 0,
      rightPadding: 0  // Set later, for when axis markers labels protrude (VIS-146)
    }
    this.verticalPadding = 5
    this.horizontalPadding = 10

    this.bounds = {
      xmin: xBoundsMinimum,
      xmax: xBoundsMaximum,
      ymin: yBoundsMinimum,
      ymax: yBoundsMaximum
    }

    this.title = {
      text: title,
      color: titleFontColor,
      anchor: 'middle',
      fontSize: titleFontSize,
      fontWeight: 'normal',
      fontFamily: titleFontFamily
    }

    if (this.title.text === '') {
      this.title.textHeight = 0
      this.title.paddingBot = 0
    } else {
      this.title.textHeight = titleFontSize
      this.title.paddingBot = 20
    }

    this.title.y = this.verticalPadding + this.title.textHeight

    this.grid = !(_.isNull(grid)) ? grid : true
    this.origin = !(_.isNull(origin)) ? origin : true
    this.fixedRatio = !(_.isNull(fixedRatio)) ? fixedRatio : true

    if (_.isNull(this.label)) {
      this.label = _.map(X, () => { return '' })
      this.showLabels = false
    }

    this.setDim(this.svg, this.width, this.height)
  }

  setDim (svg, width, height) {
    this.svg = svg
    this.width = width
    this.height = height
    this.title.x = this.width / 2
    this.legend = new Legend(this.legendSettings)

    this.viewBoxDim = {
      svgWidth: width,
      svgHeight: height,
      width: width - this.legend.getWidth() - (this.horizontalPadding * 3) - this.axisLeaderLineLength - this.axisDimensionText.rowMaxWidth - this.yTitle.textHeight - this.axisDimensionText.rightPadding,
      height: height - (this.verticalPadding * 2) - this.title.textHeight - this.title.paddingBot - this.axisDimensionText.colMaxHeight - this.xTitle.textHeight - this.axisLeaderLineLength - this.xTitle.topPadding,
      x: (this.horizontalPadding * 2) + this.axisDimensionText.rowMaxWidth + this.axisLeaderLineLength + this.yTitle.textHeight,
      y: this.verticalPadding + this.title.textHeight + this.title.paddingBot,
      labelFontSize: this.labelsFont.size,
      labelSmallFontSize: this.labelsFont.size * 0.75,
      labelFontColor: this.labelsFont.color,
      labelFontFamily: this.labelsFont.family,
      labelLogoScale: this.labelsFont.logoScale
    }

    this.legend.setX(this.viewBoxDim.x + this.viewBoxDim.width)
    this.title.x = this.viewBoxDim.x + (this.viewBoxDim.width / 2)

    this.data = new PlotData(this.X,
                         this.Y,
                         this.Z,
                         this.group,
                         this.label,
                         this.labelAlt,
                         this.viewBoxDim,
                         this.legend,
                         this.colors,
                         this.fixedRatio,
                         this.originAlign,
                         this.pointRadius,
                         this.bounds,
                         this.transparency,
                         this.legendSettings,
                         this.axisDimensionText)

    this.drawFailureCount = 0
  }

  draw () {
    this.drawDimensionMarkers()
      .then(this.drawLegend.bind(this))
      .then(this.drawLabsAndPlot.bind(this))
      .then(() => {
        // TODO Po if you remove this then the life expectancy bubble plot will not have the legendLabels in the legend. It will only have the groups
        if (this.data.legendRequiresRedraw) {
          return this.drawLegend()
        }
      })
      .then(() => {
        console.log(`draw succeeded after ${this.drawFailureCount} failures`)
        this.drawFailureCount = 0
      })
      .catch((err) => {
        this.drawFailureCount++
        if (this.drawFailureCount >= this.maxDrawFailureCount) {
          console.log(`draw failure ${err.message} (fail count: ${this.drawFailureCount}). Exceeded max draw failures of ${this.maxDrawFailureCount}. Terminating`)
          throw err
        }

        if (err && err.retry) {
          console.log(`draw failure ${err.message} (fail count: ${this.drawFailureCount}). Redrawing`)
          return this.draw()
        }

        throw err
      })
  }

  isEqual (otherPlot) {
    // Test if RectPlot is equal to another, does not include all parameters for comparison (only those set in Displayr added now)
    // TODO: Add rest of the data components
    const eqX = _.isEqual(this.X, otherPlot.X)
    const eqY = _.isEqual(this.Y, otherPlot.Y)
    const eqZ = _.isEqual(this.Z, otherPlot.Z)
    const eqGroup = _.isEqual(this.group, otherPlot.group)
    const eqLabel = _.isEqual(this.label, otherPlot.label)
    const eqLabelAlt = _.isEqual(this.labelAlt, otherPlot.labelAlt)
    const eqTitle = _.isEqual(this.title.text, otherPlot.title)
    const eqXTitle = _.isEqual(this.xTitle.text, otherPlot.xTitle)
    const eqYTitle = _.isEqual(this.yTitle.text, otherPlot.yTitle)
    const eqZTitle = _.isEqual(this.zTitle, otherPlot.zTitle)
    const listOfComparisons = [eqX, eqY, eqZ, eqGroup, eqLabel, eqLabelAlt, eqTitle, eqXTitle, eqYTitle, eqZTitle]
    return _.every(listOfComparisons, e => _.isEqual(e, true))
  }

  drawLabsAndPlot () {
    this.data.normalizeData()

    return this.data.getPtsAndLabs('RectPlot.drawLabsAndPlot').then(() => {
      this.title.x = this.viewBoxDim.x + (this.viewBoxDim.width / 2)

      if (!this.state.isLegendPtsSynced(this.data.outsidePlotPtsId)) {
        for (var pt of Array.from(this.state.getLegendPts())) {
          if (!_.includes(this.data.outsidePlotPtsId, pt)) {
            this.data.addElemToLegend(pt)
          }
        }

        for (pt of Array.from(this.data.outsidePlotPtsId)) {
          if (!_.includes(this.state.getLegendPts(), pt)) {
            this.state.pushLegendPt(pt)
          }
        }
        const error = new Error('drawLabsAndPlot failed : state.isLegendPtsSynced = false')
        error.retry = true
        throw error
      }
    }).then(() => {
      try {
        this.drawTitle()
        this.drawResetButton()
        this.drawAnc()
        this.drawLabs()
        if (this.trendLines.show) { this.drawTrendLines() }
        this.drawDraggedMarkers()
        if (this.plotBorder.show) { this.drawRect() }
        this.drawAxisLabels()
      } catch (error) {
        console.log(error)
      }
    })
  }

  drawTitle () {
    if (this.title.text !== '') {
      this.svg.selectAll('.plot-title').remove()
      this.svg.append('text')
          .attr('class', 'plot-title')
          .attr('font-family', this.title.fontFamily)
          .attr('x', this.title.x)
          .attr('y', this.title.y)
          .attr('text-anchor', this.title.anchor)
          .attr('fill', this.title.color)
          .attr('font-size', this.title.fontSize)
          .attr('font-weight', this.title.fontWeight)
          .text(this.title.text)
    }
  }

  drawResetButton () {
    this.svg.selectAll('.plot-reset-button').remove()
    const svgResetButton = this.svg.append('text')
        .attr('class', 'plot-reset-button')
        .attr('font-family', this.title.fontFamily)
        .attr('fill', '#5B9BD5')
        .attr('font-size', 10)
        .attr('font-weight', 'normal')
        .style('opacity', 0)
        .text('Reset')
        .attr('cursor', 'pointer')
        .on('click', () => {
          this.data.resetLegendPts()
          this.state.resetStateLegendPtsAndPositionedLabs()
          this.draw()
        })
    this.svg
        .on('mouseover', () => { if (this.state.hasStateBeenAlteredByUser()) svgResetButton.style('opacity', 1) })
        .on('mouseout', () => svgResetButton.style('opacity', 0))

    const svgResetButtonBB = svgResetButton.node().getBBox()
    const xAxisPadding = 5
    svgResetButton.attr('x', this.width - svgResetButtonBB.width - xAxisPadding)
                  .attr('y', this.height - svgResetButtonBB.height)
  }

  drawRect () {
    this.svg.selectAll('.plot-viewbox').remove()
    this.svg.append('rect')
        .attr('class', 'plot-viewbox')
        .attr('x', this.viewBoxDim.x)
        .attr('y', this.viewBoxDim.y)
        .attr('width', this.viewBoxDim.width)
        .attr('height', this.viewBoxDim.height)
        .attr('fill', 'none')
        .attr('stroke', this.plotBorder.color)
        .attr('stroke-width', this.plotBorder.width)
  }

  drawDimensionMarkers () {
    return new Promise((function (resolve, reject) {
      const axisArrays = AxisUtils.getAxisDataArrays(this, this.data, this.viewBoxDim, this.axisSettings)

      // TODO KZ this sequence can be easily consolidated
      if (this.grid) {
        this.svg.selectAll('.origin').remove()
        this.svg.selectAll('.origin')
            .data(axisArrays.gridOrigin)
            .enter()
            .append('line')
            .attr('class', 'origin')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
            .attr('stroke-width', 0.2)
            .attr('stroke', 'grey')
        if (this.origin) {
          this.svg.selectAll('.origin')
              .style('stroke-dasharray', ('4, 6'))
              .attr('stroke-width', 1)
              .attr('stroke', 'black')
        }

        this.svg.selectAll('.dim-marker').remove()
        this.svg.selectAll('.dim-marker')
                 .data(axisArrays.gridLines)
                 .enter()
                 .append('line')
                 .attr('class', 'dim-marker')
                 .attr('x1', d => d.x1)
                 .attr('y1', d => d.y1)
                 .attr('x2', d => d.x2)
                 .attr('y2', d => d.y2)
                 .attr('stroke-width', 0.2)
                 .attr('stroke', 'grey')
      } else if (!this.grid && this.origin) {
        this.svg.selectAll('.origin').remove()
        this.svg.selectAll('.origin')
            .data(axisArrays.gridOrigin)
            .enter()
            .append('line')
            .attr('class', 'origin')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
            .style('stroke-dasharray', ('4, 6'))
            .attr('stroke-width', 1)
            .attr('stroke', 'black')
      }

      if (this.axisSettings.showX || this.axisSettings.showY) {
        this.svg.selectAll('.dim-marker-leader').remove()
        this.svg.selectAll('.dim-marker-leader')
        .data(axisArrays.axisLeader)
        .enter()
        .append('line')
        .attr('class', 'dim-marker-leader')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .attr('stroke-width', 1)
        .attr('stroke', 'black')

        this.svg.selectAll('.dim-marker-label').remove()
        const markerLabels = this.svg.selectAll('.dim-marker-label')
        .data(axisArrays.axisLeaderLabel)
        .enter()
        .append('text')
        .attr('class', 'dim-marker-label')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-family', this.axisSettings.fontFamily)
        .attr('fill', this.axisSettings.fontColor)
        .attr('font-size', this.axisSettings.fontSize)
        .text(d => d.label)
        .attr('text-anchor', d => d.anchor)
        .attr('type', d => d.type)

        // Figure out the max width of the yaxis dimensional labels
        const initAxisTextRowWidth = this.axisDimensionText.rowMaxWidth
        const initAxisTextColWidth = this.axisDimensionText.colMaxWidth
        const initAxisTextRowHeight = this.axisDimensionText.rowMaxHeight
        const initAxisTextColHeight = this.axisDimensionText.colMaxHeight
        for (let i = 0; i < markerLabels[0].length; i++) {
          const markerLabel = markerLabels[0][i]
          const labelType = d3.select(markerLabel).attr('type')
          const bb = markerLabel.getBBox()
          if ((this.axisDimensionText.rowMaxWidth < bb.width) && (labelType === 'row')) { this.axisDimensionText.rowMaxWidth = bb.width }
          if ((this.axisDimensionText.colMaxWidth < bb.width) && (labelType === 'col')) { this.axisDimensionText.colMaxWidth = bb.width }
          if ((this.axisDimensionText.rowMaxHeight < bb.height) && (labelType === 'row')) { this.axisDimensionText.rowMaxHeight = bb.height }
          if ((this.axisDimensionText.colMaxHeight < bb.height) && (labelType === 'col')) { this.axisDimensionText.colMaxHeight = bb.height }

          if (this.width < (bb.x + bb.width)) {
            this.axisDimensionText.rightPadding = bb.width / 2
          }
        }

        if ((initAxisTextRowWidth !== this.axisDimensionText.rowMaxWidth) ||
          (initAxisTextColWidth !== this.axisDimensionText.colMaxWidth) ||
          (initAxisTextRowHeight !== this.axisDimensionText.rowMaxHeight) ||
          (initAxisTextColHeight !== this.axisDimensionText.colMaxHeight)) {
          this.setDim(this.svg, this.width, this.height)
          this.data.revertMinMax()
          const error = new Error('axis marker out of bound')
          error.retry = true
          return reject(error)
        }
      }

      return resolve()
    }.bind(this)))
  }

  drawAxisLabels () {
    const axisLabels = [
      { // x axis label
        x: this.viewBoxDim.x + (this.viewBoxDim.width / 2),
        y: this.viewBoxDim.y + this.viewBoxDim.height +
           this.axisLeaderLineLength +
           this.axisDimensionText.colMaxHeight +
           this.xTitle.topPadding +
           this.xTitle.textHeight,
        text: this.xTitle.text,
        anchor: 'middle',
        transform: 'rotate(0)',
        display: this.xTitle === '' ? 'none' : '',
        fontFamily: this.xTitle.fontFamily,
        fontSize: this.xTitle.fontSize,
        fontColor: this.xTitle.fontColor
      },
      { // y axis label
        x: this.horizontalPadding + this.yTitle.textHeight,
        y: this.viewBoxDim.y + (this.viewBoxDim.height / 2),
        text: this.yTitle.text,
        anchor: 'middle',
        transform: `rotate(270,${this.horizontalPadding + this.yTitle.textHeight}, ${this.viewBoxDim.y + (this.viewBoxDim.height / 2)})`,
        display: this.yTitle === '' ? 'none' : '',
        fontFamily: this.yTitle.fontFamily,
        fontSize: this.yTitle.fontSize,
        fontColor: this.yTitle.fontColor
      }
    ]

    this.svg.selectAll('.axis-label').remove()
    return this.svg.selectAll('.axis-label')
             .data(axisLabels)
             .enter()
             .append('text')
             .attr('class', 'axis-label')
             .attr('x', d => d.x)
             .attr('y', d => d.y)
             .attr('font-family', d => d.fontFamily)
             .attr('font-size', d => d.fontSize)
             .attr('fill', d => d.fontColor)
             .attr('text-anchor', d => d.anchor)
             .attr('transform', d => d.transform)
             .text(d => d.text)
             .style('font-weight', 'normal')
             .style('display', d => d.display)
  }

  drawLegend () {
    return new Promise(function (resolve, reject) {
      this.data.setupLegendGroupsAndPts()
      if (this.legendSettings.showBubblesInLegend() && Utils.isArrOfNums(this.Z)) {
        this.svg.selectAll('.legend-bubbles').remove()
        this.svg.selectAll('.legend-bubbles')
            .data(this.legend.getBubbles())
            .enter()
            .append('circle')
            .attr('class', 'legend-bubbles')
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('r', d => d.r)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-opacity', 0.5)

        this.svg.selectAll('.legend-bubbles-labels').remove()
        this.svg.selectAll('.legend-bubbles-labels')
            .data(this.legend.getBubbles())
            .enter()
            .append('text')
            .attr('class', 'legend-bubbles-labels')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('text-anchor', 'middle')
            .attr('font-size', this.legendSettings.getFontSize())
            .attr('font-family', this.legendSettings.getFontFamily())
            .attr('fill', this.legendSettings.getFontColor())
            .text(d => d.text)

        if (this.zTitle !== '') {
          this.svg.selectAll('.legend-bubbles-title').remove()
          let legendFontSize = this.legendSettings.getFontSize()
          const legendBubbleTitleSvg = this.svg.selectAll('.legend-bubbles-title')
              .data(this.legend.getBubblesTitle())
              .enter()
              .append('text')
              .attr('class', 'legend-bubbles-title')
              .attr('x', d => d.x)
              .attr('y', d => d.y - (legendFontSize * 1.5))
              .attr('text-anchor', 'middle')
              .attr('font-family', this.legendSettings.getFontFamily())
              .attr('font-weight', 'normal')
              .attr('fill', this.legendSettings.getFontColor())
              .text(this.zTitle)

          SvgUtils.setSvgBBoxWidthAndHeight(this.legend.getBubblesTitle(), legendBubbleTitleSvg)
        }
      }

      const drag = DragUtils.getLegendLabelDragAndDrop(this, this.data)
      this.svg.selectAll('.legend-dragged-pts-text').remove()
      this.svg.selectAll('.legend-dragged-pts-text')
          .data(this.data.legendPts)
          .enter()
          .append('text')
          .attr('class', 'legend-dragged-pts-text')
          .attr('id', d => `legend-${d.id}`)
          .attr('x', d => d.x)
          .attr('y', d => d.y)
          .attr('font-family', this.legendSettings.getFontFamily())
          .attr('font-size', this.legendSettings.getFontSize())
          .attr('text-anchor', d => d.anchor)
          .attr('fill', d => d.color)
          .text(d => { if (!(_.isNull(d.markerId))) { return Utils.getSuperscript(d.markerId + 1) + d.text } else { return d.text } })
          .call(drag)

      SvgUtils.setSvgBBoxWidthAndHeight(this.data.legendPts, this.svg.selectAll('.legend-dragged-pts-text'))

      if (this.legendSettings.showLegend()) {
        this.svg.selectAll('.legend-groups-text').remove()
        this.svg.selectAll('.legend-groups-text')
            .data(this.data.legendGroups)
            .enter()
            .append('text')
            .attr('class', 'legend-groups-text')
            .attr('x', d => d.x)
            .attr('y', d => d.y)
            .attr('font-family', this.legendSettings.getFontFamily())
            .attr('fill', this.legendSettings.getFontColor())
            .attr('font-size', this.legendSettings.getFontSize())
            .text(d => d.text)
            .attr('text-anchor', d => d.anchor)

        this.svg.selectAll('.legend-groups-pts').remove()
        this.svg.selectAll('.legend-groups-pts')
                 .data(this.data.legendGroups)
                 .enter()
                 .append('circle')
                 .attr('class', 'legend-groups-pts')
                 .attr('cx', d => d.cx)
                 .attr('cy', d => d.cy)
                 .attr('r', d => d.r)
                 .attr('fill', d => d.color)
                 .attr('stroke', d => d.stroke)
                 .attr('stroke-opacity', d => d['stroke-opacity'])
                 .attr('fill-opacity', d => d.fillOpacity)

        // Height and width are not provided
        SvgUtils.setSvgBBoxWidthAndHeight(this.data.legendGroups, this.svg.selectAll('.legend-groups-text'))
      }

      if (this.legendSettings.showLegend() || (this.legendSettings.showBubblesInLegend() && Utils.isArrOfNums(this.Z)) || !(_.isNull(this.data.legendPts))) {
        if (this.data.resizedAfterLegendGroupsDrawn(this.legendSettings.showLegend())) {
          this.data.revertMinMax()
          const error = new Error('drawLegend Failed')
          error.retry = true
          return reject(error)
        }
      }
      return resolve()
    }.bind(this))
  }

  drawAnc () {
    this.svg.selectAll('.anc').remove()
    const anc = this.svg.selectAll('.anc')
             .data(this.data.pts)
             .enter()
             .append('circle')
             .attr('class', 'anc')
             .attr('id', d => `anc-${d.id}`)
             .attr('cx', d => d.x)
             .attr('cy', d => d.y)
             .attr('fill', d => d.color)
             .attr('fill-opacity', d => d.fillOpacity)
             .attr('r', (d) => {
               if (this.trendLines.show) {
                 return this.trendLines.pointSize
               } else {
                 return d.r
               }
             })
    TooltipUtils.appendTooltips(anc, this.Z, this.xDecimals, this.yDecimals,
      this.zDecimals, this.xPrefix, this.yPrefix, this.zPrefix, this.xSuffix, this.ySuffix, this.zSuffix)
    // Clip paths used to crop bubbles if they expand beyond the plot's borders
    if (Utils.isArrOfNums(this.Z)) {
      this.svg.selectAll('clipPath').remove()
      SvgUtils.clipBubbleIfOutsidePlotArea(this.svg, this.data.pts, this.viewBoxDim)
    }
  }

  drawDraggedMarkers () {
    this.svg.selectAll('.marker').remove()
    this.svg.selectAll('.marker')
        .data(this.data.outsidePlotMarkers)
        .enter()
        .append('line')
        .attr('class', 'marker')
        .attr('x1', d => d.x1)
        .attr('y1', d => d.y1)
        .attr('x2', d => d.x2)
        .attr('y2', d => d.y2)
        .attr('stroke-width', d => d.width)
        .attr('stroke', d => d.color)

    this.svg.selectAll('.marker-label').remove()
    return this.svg.selectAll('.marker-label')
        .data(this.data.outsidePlotMarkers)
        .enter()
        .append('text')
        .attr('class', 'marker-label')
        .attr('x', d => d.markerTextX)
        .attr('y', d => d.markerTextY)
        .attr('font-family', 'Arial')
        .attr('text-anchor', 'start')
        .attr('font-size', this.legend.getMarkerTextSize())
        .attr('fill', d => d.color)
        .text(d => d.markerLabel)
  }

  resetPlotAfterDragEvent () {
    const plotElems = [
      '.plot-viewbox',
      '.origin',
      '.dim-marker',
      '.dim-marker-leader',
      '.dim-marker-label',
      '.axis-label',
      '.legend-pts',
      '.legend-text',
      '.anc',
      '.lab',
      '.link'
    ]
    for (const elem of Array.from(plotElems)) {
      this.svg.selectAll(elem).remove()
    }
    return this.draw()
  }

  drawLabs () {
    let drag
    if (this.showLabels && !this.trendLines.show) {
      drag = DragUtils.getLabelDragAndDrop(this)
      this.state.updateLabelsWithPositionedData(this.data.lab, this.data.viewBoxDim)

      this.svg.selectAll('.lab-img').remove()
      this.svg.selectAll('.lab-img')
          .data(this.data.lab)
          .enter()
          .append('svg:image')
          .attr('class', 'lab-img')
          .attr('xlink:href', d => d.url)
          .attr('id', d => { if (d.url !== '') { return d.id } })
          .attr('x', d => d.x - (d.width / 2))
          .attr('y', d => d.y - d.height)
          .attr('width', d => d.width)
          .attr('height', d => d.height)
          .call(drag)

      this.svg.selectAll('.lab').remove()
      this.svg.selectAll('.lab')
               .data(this.data.lab)
               .enter()
               .append('text')
               .attr('class', 'lab')
               .attr('id', d => { if (d.url === '') { return d.id } })
               .attr('x', d => d.x)
               .attr('y', d => d.y)
               .attr('font-family', d => d.fontFamily)
               .text(d => { if (d.url === '') { return d.text } })
               .attr('text-anchor', 'middle')
               .attr('fill', d => d.color)
               .attr('font-size', d => d.fontSize)
               .call(drag)

      LabelPlacement.placeLabels(
        this.svg,
        this.data.viewBoxDim,
        this.data.pts,
        this.data.lab,
        this.state
      )

      this.drawLinks()
    } else if (this.showLabels && this.trendLines.show) {
      this.tl = new TrendLine(this.data.pts, this.data.lab)
      this.state.updateLabelsWithPositionedData(this.data.lab, this.data.viewBoxDim)

      drag = DragUtils.getLabelDragAndDrop(this, this.trendLines.show)

      this.svg.selectAll('.lab-img').remove()
      this.svg.selectAll('.lab-img')
        .data(this.tl.arrowheadLabels)
        .enter()
        .append('svg:image')
        .attr('class', 'lab-img')
        .attr('xlink:href', d => d.url)
        .attr('id', d => { if (d.url !== '') { return d.id } })
        .attr('x', d => d.x - (d.width / 2))
        .attr('y', d => d.y - d.height)
        .attr('width', d => d.width)
        .attr('height', d => d.height)
        .call(drag)

      this.svg.selectAll('.lab').remove()
      this.svg.selectAll('.lab')
        .data(this.tl.arrowheadLabels)
        .enter()
        .append('text')
        .attr('class', 'lab')
        .attr('id', d => { if (d.url === '') { return d.id } })
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-family', d => d.fontFamily)
        .text(d => { if (d.url === '') { return d.text } })
        .attr('text-anchor', 'middle')
        .attr('fill', d => d.color)
        .attr('font-size', d => d.fontSize)
        .call(drag)

      LabelPlacement.placeTrendLabels(
        this.svg,
        this.data.viewBoxDim,
        this.tl.arrowheadPts,
        this.tl.arrowheadLabels,
        this.state
      )
    }
  }

  drawLinks () {
    const links = new Links(this.data.pts, this.data.lab)
    this.svg.selectAll('.link').remove()
    this.svg.selectAll('.link')
            .data(links.getLinkData())
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('x1', d => d.x1)
            .attr('y1', d => d.y1)
            .attr('x2', d => d.x2)
            .attr('y2', d => d.y2)
            .attr('stroke-width', d => d.width)
            .attr('stroke', d => d.color)
            .style('stroke-opacity', this.data.plotColors.getFillOpacity(this.transparency))
  }

  drawTrendLines () {
    this.state.updateLabelsWithPositionedData(this.data.lab, this.data.viewBoxDim)
    if ((this.tl === undefined) || (this.tl === null)) {
      this.tl = new TrendLine(this.data.pts, this.data.lab)
    }

    _.map(this.tl.getUniqueGroups(), (group) => {
      // Need new groupName because CSS ids cannot contain spaces and maintain uniqueness
      const cssGroupName = md5(group)

      // Arrowhead marker
      this.svg.selectAll(`#triangle-${cssGroupName}`).remove()
      this.svg.append('svg:defs').append('svg:marker')
          .attr('id', `triangle-${cssGroupName}`)
          .attr('refX', 6)
          .attr('refY', 6)
          .attr('markerWidth', 30)
          .attr('markerHeight', 30)
          .attr('orient', 'auto')
          .append('path')
          .attr('d', 'M 0 0 12 6 0 12 3 6')
          .style('fill', this.data.plotColors.getColorFromGroup(group))

      this.svg.selectAll(`.trendline-${cssGroupName}`).remove()
      this.svg.selectAll(`.trendline-${cssGroupName}`)
        .data(this.tl.getLineArray(group))
        .enter()
        .append('line')
        .attr('class', `trendline-${cssGroupName}`)
        .attr('x1', d => d[0])
        .attr('y1', d => d[1])
        .attr('x2', d => d[2])
        .attr('y2', d => d[3])
        .attr('stroke', this.data.plotColors.getColorFromGroup(group))
        .attr('stroke-width', this.trendLines.lineThickness)
        .attr('marker-end', (d, i) => {
          // Draw arrowhead on last element in trendline
          if (i === ((this.tl.getLineArray(group)).length - 1)) {
            return `url(#triangle-${cssGroupName})`
          }
        })
    })
  }
}

module.exports = RectPlot