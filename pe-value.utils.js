const PEValue = (
  eps,
  historicalPE,
  expectedGrowthRate,
  marginOfSafety,
  discountRate,
  numberOfYears
) => {
  console.log(`
    ${eps}, 
    ${historicalPE}, 
    ${expectedGrowthRate}, 
    ${marginOfSafety}, 
    ${discountRate}, 
    ${numberOfYears} 
  `);
  const conservativeGrowthRate =
    expectedGrowthRate * (1 - marginOfSafety / 100);
  let epsYearly = [];
  for (let i = 0; i < numberOfYears; i++) {
    if (i === 0) {
      epsYearly.push(eps * (1 + conservativeGrowthRate / 100));
    } else {
      epsYearly.push(epsYearly[i - 1] * (1 + conservativeGrowthRate / 100));
    }
  }

  const valueAtEndOfPeriod = epsYearly[epsYearly.length - 1] * historicalPE;

  const presentValue =
    valueAtEndOfPeriod / (1 + discountRate / 100) ** numberOfYears;

  console.log('presentVal: ', presentValue);

  return {
    conservativeGrowthRate,
    epsYearly,
    valueAtEndOfPeriod,
    presentValue,
  };
};

module.exports = PEValue;
