const ROEValue = (
  shareHoldersEquity,
  ROE,
  sharesOutstanding,
  dividend,
  expectedGrowthRate,
  marginOfSafety,
  discountRate,
  numberOfYears
) => {
  console.log(`
    ${shareHoldersEquity},
    ${ROE},
    ${sharesOutstanding},
    ${dividend},
    ${expectedGrowthRate},
    ${marginOfSafety},
    ${discountRate},
    ${numberOfYears}
  `);
  const conservativeGrowthRate =
    expectedGrowthRate * (1 - marginOfSafety / 100);

  let yearlyCalc = [];
  // 1st year
  let yearlyShareHoldersEquity =
    (shareHoldersEquity * (1 + conservativeGrowthRate / 100)) /
    sharesOutstanding;
  let yearlyDividend = dividend * (1 + conservativeGrowthRate / 100);
  let yearlyNpvDividend = yearlyDividend / (1 + discountRate / 100) ** (1 - 1);
  yearlyCalc.push({
    yearlyShareHoldersEquity,
    yearlyDividend,
    yearlyNpvDividend,
  });

  for (let i = 1; i < numberOfYears; i++) {
    yearlyShareHoldersEquity =
      yearlyCalc[i - 1].yearlyShareHoldersEquity *
      (1 + conservativeGrowthRate / 100);
    yearlyDividend =
      yearlyCalc[i - 1].yearlyDividend * (1 + conservativeGrowthRate / 100);
    yearlyNpvDividend = yearlyDividend / (1 + discountRate / 100) ** i;
    yearlyCalc.push({
      yearlyShareHoldersEquity,
      yearlyDividend,
      yearlyNpvDividend,
    });
  }

  const year10NetIncome =
    yearlyCalc[yearlyCalc.length - 1].yearlyShareHoldersEquity * (ROE / 100);
  // console.log('year10: ', yearlyCalc[yearlyCalc.length].shareHoldersEquity);
  const requiredValue = year10NetIncome / (discountRate / 100);
  const npvRequiredValue =
    requiredValue / (1 + discountRate / 100) ** numberOfYears;
  const npvDividends = yearlyCalc.reduce(
    (totalDividends, calc) => calc.yearlyNpvDividend + totalDividends,
    0
  );
  const ROEValue = npvRequiredValue + npvDividends;

  return {
    conservativeGrowthRate,
    yearlyCalc,
    year10NetIncome,
    requiredValue,
    npvRequiredValue,
    npvDividends,
    ROEValue,
  };
};

module.exports = ROEValue;
