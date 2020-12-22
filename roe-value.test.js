const ROEValue = require('./roe-value.utils');

test('ROE Value', () => {
  expect(ROEValue(372649000, 4.89, 343990000, 0.03, 7.68, 25, 3, 10)).toEqual({
    conservativeGrowthRate: 5.76,
    yearlyCalc: [
      {
        yearlyDividend: 0.031728,
        yearlyNpvDividend: 0.031728,
        yearlyShareHoldersEquity: 1.145712324195471,
      },
      {
        yearlyDividend: 0.0335555328,
        yearlyNpvDividend: 0.03257818718446602,
        yearlyShareHoldersEquity: 1.2117053540691303,
      },
      {
        yearlyDividend: 0.03548833148928,
        yearlyNpvDividend: 0.03345115608377793,
        yearlyShareHoldersEquity: 1.2814995824635123,
      },
      {
        yearlyDividend: 0.03753245938306254,
        yearlyNpvDividend: 0.034347517159420915,
        yearlyShareHoldersEquity: 1.3553139584134106,
      },
      {
        yearlyDividend: 0.039694329043526946,
        yearlyNpvDividend: 0.03526789723087724,
        yearlyShareHoldersEquity: 1.4333800424180232,
      },
      {
        yearlyDividend: 0.0419807223964341,
        yearlyNpvDividend: 0.03621293991395706,
        yearlyShareHoldersEquity: 1.5159427328613015,
      },
      {
        yearlyDividend: 0.04439881200646871,
        yearlyNpvDividend: 0.03718330607087475,
        yearlyShareHoldersEquity: 1.6032610342741127,
      },
      {
        yearlyDividend: 0.046956183578041315,
        yearlyNpvDividend: 0.038179674272385576,
        yearlyShareHoldersEquity: 1.6956088698483018,
      },
      {
        yearlyDividend: 0.0496608597521365,
        yearlyNpvDividend: 0.03920274127230581,
        yearlyShareHoldersEquity: 1.7932759407515642,
      },
      {
        yearlyDividend: 0.05252132527385957,
        yearlyNpvDividend: 0.040253222494748185,
        yearlyShareHoldersEquity: 1.8965686349388544,
      },
    ],
    year10NetIncome: 0.09274220624850998,
    requiredValue: 3.0914068749503327,
    npvRequiredValue: 2.3002970441204433,
    npvDividends: 0.3584046416828135,
    ROEValue: 2.6587016858032566,
  });
});
