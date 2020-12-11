const DCFValue = (
  cash,
  totalLiabilities,
  freeCashFlow,
  sharesOutstanding,
  expectedGrowthRate,
  marginOfSafety,
  growthDeclineRate,
  discountRate,
  FCFMultiplierYears,
  numberOfYears
) => {
  console.log(`
    ${cash},
    ${totalLiabilities},
    ${freeCashFlow},
    ${sharesOutstanding},
    ${expectedGrowthRate},
    ${marginOfSafety},
    ${growthDeclineRate},
    ${discountRate},
    ${FCFMultiplierYears},
    ${numberOfYears},
  `);
  const conservativeGrowthRate =
    expectedGrowthRate * (1 - marginOfSafety / 100);
  let fcfYearly = [];
  let npvFcfYearly = [];
  fcfYearly.push(freeCashFlow * (1 + conservativeGrowthRate / 100));
  npvFcfYearly.push(fcfYearly[0] / (1 + discountRate / 100) ** 1);
  for (let i = 1; i < numberOfYears; i++) {
    fcfYearly.push(
      fcfYearly[i - 1] *
        (1 +
          (conservativeGrowthRate / 100) * (1 - growthDeclineRate / 100) ** i)
    );
    npvFcfYearly.push(fcfYearly[i] / (1 + discountRate / 100) ** (i + 1));
  }
  const totalNpvFcf = npvFcfYearly.reduce((total, val) => total + val);
  const year10FcfValue = npvFcfYearly[numberOfYears - 1] * FCFMultiplierYears;
  const companyValue = totalNpvFcf + year10FcfValue + cash - totalLiabilities;
  const DcfValue = companyValue / sharesOutstanding;

  return {
    conservativeGrowthRate,
    fcfYearly,
    npvFcfYearly,
    totalNpvFcf,
    year10FcfValue,
    companyValue,
    DcfValue,
  };
};

module.exports = DCFValue;
