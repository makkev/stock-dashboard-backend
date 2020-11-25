const PEValue = require('./pe-value.utils');
test('PE Value', () => {
  expect(PEValue(11.89, 15.4, 9.86, 25, 9, 5)).toEqual({
    conservativeGrowthRate: 7.395,
    epsYearly: [
      12.7692655,
      13.713552683724998,
      14.727669904686461,
      15.816781094138024,
      16.98643205604953,
    ],
    valueAtEndOfPeriod: 261.59105366316277,
    presentValue: 170.0162361505442,
  });
});
