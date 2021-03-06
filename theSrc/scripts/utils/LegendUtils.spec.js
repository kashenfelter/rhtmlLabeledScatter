const LegendUtils = require('./LegendUtils.js')

describe('LegendUtils:', function () {
  // KZ TODO assuming lab are constant this test is more useful if it is just
  //   in/out with zMax => [topLabel, midLabel, botLabel
  describe('getZQuartiles():', function () {
    it('computes top, mid, and bot quartile thresholds for zMax=10000', function () {
      const zQuartiles = LegendUtils.getZQuartiles(10000)

      const errorMessage = `
      Quartiles did not pass test:
      ${JSON.stringify(zQuartiles, {}, 2)}
      `

      expect(zQuartiles, errorMessage).to.deep.equal({
        top: { lab: '9.00k', val: 0.5352372348458313 },
        mid: { lab: '4.00k', val: 0.3568248232305542 },
        bot: { lab: '1.00k', val: 0.1784124116152771 }
      })
    })

    it('computes top, mid, and bot quartile thresholds for zMax=1000000', function () {
      const zQuartiles = LegendUtils.getZQuartiles(1000000)

      const errorMessage = `
      Quartiles did not pass test:
      ${JSON.stringify(zQuartiles, {}, 2)}
      `

      expect(zQuartiles, errorMessage).to.deep.equal({
        top: { lab: '900k', val: 0.5352372348458313 },
        mid: { lab: '400k', val: 0.3568248232305542 },
        bot: { lab: '100k', val: 0.1784124116152771 }
      })
    })
  })
})
