const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const fs = require('fs');

const PEValue = require('./pe-value.utils');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const { securityList, eps, pe, watchList, growth } = require('./data');
const EPS_FILE = '/Users/KM/git/web-scraping/data/out/eps.json';
const GROWTH_FILE = '/Users/KM/git/web-scraping/data/out/growth.json';
const PE_FILE = '/Users/KM/git/web-scraping/data/out/pe.json';
const PRICE_FILE = '/Users/KM/git/web-scraping/data/out/price.json';

const MARGIN_OF_SAFETY = 25; // percent
const DISCOUNT_RATE = 2; // percent
const NUMBER_OF_YEARS = 5;

const database = {
  users: [
    {
      id: '123',
      name: 'Kevin',
      email: 'kevinmak05@gmail.com',
      password: 'cookies',
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Weng',
      email: 'wengmak@yahoo.com',
      password: 'bananas',
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send('this is working');
});

app.post('/signin', (req, res) => {
  bcrypt.compare(
    'bacon',
    '$2a$10$bsSI1LLPMhgyRJ7cQ7kt/e7mEd5F06Pb12tvRPPqB6s1Z2nOW5ypq',
    function (err, res) {
      console.log('first guess: ', res);
    }
  );
  bcrypt.compare(
    'veggies',
    '$2a$10$bsSI1LLPMhgyRJ7cQ7kt/e7mEd5F06Pb12tvRPPqB6s1Z2nOW5ypq',
    function (err, res) {
      console.log('second guess: ', res);
    }
  );
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  bcrypt.hash('bacon', null, null, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash);
  });

  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: password,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/securityList', (req, res) => {
  res.json(securityList);
});

// const peCalcVal = (
//   eps,
//   medianHistoricalPE,
//   expectedGrowthRate,
//   marginOfSafety,
//   discountRate,
//   numOfYears
// ) => {
//   const conservativeGrowthRate =
//     expectedGrowthRate * (1 - marginOfSafety / 100);

//   let annualEps = [];
//   annualEps[0] = eps * (1 + rate / 100);
//   for (let i = 0; i <= numOfYears; i++) {
//     annualEps = annualEps[i - 1] * (1 + conservativeGrowthRate / 100);
//   }

//   const finalVal = annualEps[annualEps.length - 1] * medianHistoricalPE;

//   const presentVal = finalVal / (1 + discountRate / 100) ** 5;

//   return {
//     eps,
//     medianHistoricalPE,
//     expectedGrowthRate,
//     marginOfSafety,
//     discountRate,
//     conservativeGrowthRate,
//     annualEps,
//     finalVal,
//     presentVal,
//   };
// };

const getSecurityDetails = securityCode => {
  const epsData = JSON.parse(fs.readFileSync(EPS_FILE));
  const growthData = JSON.parse(fs.readFileSync(GROWTH_FILE));
  const peData = JSON.parse(fs.readFileSync(PE_FILE));
  const priceData = JSON.parse(fs.readFileSync(PRICE_FILE));

  return {
    securityCode,
    eps: {
      ...epsData[securityCode],
      value: Number(epsData[securityCode].value),
    },
    pe: {
      ...peData[securityCode],
      value: Number(pe[securityCode].value),
    },
    growth: {
      ...growthData[securityCode],
      value: growthData[securityCode].value.includes('%')
        ? Number(growthData[securityCode].value.replace(/\%/g, ''))
        : 'N/A',
    },
    price: {
      ...priceData[securityCode],
      value: Number(priceData[securityCode].value),
    },
    peCalc: PEValue(
      epsData[securityCode].value,
      peData[securityCode].value,
      growthData[securityCode].value.includes('%')
        ? Number(growthData[securityCode].value.replace(/\%/g, ''))
        : 0,
      MARGIN_OF_SAFETY,
      DISCOUNT_RATE,
      NUMBER_OF_YEARS
    ),
  };
};

app.get('/securityDetails/:securityCode', (req, res) => {
  const { securityCode } = req.params;
  res.json(getSecurityDetails(securityCode));
});

app.post('/addWatchList/:securityCode', (req, res) => {
  const { securityCode } = req.params;

  watchList.push(securityCode);
  res.json(watchList);
});

app.get('/watchList', (req, res) => {
  console.log('watchlist');
  let watchListDetails = {};
  watchList.forEach(securityCode => {
    console.log(securityCode);
    watchListDetails[securityCode] = getSecurityDetails(securityCode);
  });
  res.json(watchListDetails);
});

/******************************************************************************/
// bcrypt.hash('bacon', null, null, function (err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare('bacon', hash, function (err, res) {
//   // res == true
// });
// bcrypt.compare('veggies', hash, function (err, res) {
//   // res = false
// });

/******************************************************************************/

app.listen(3000);

/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/securityList --> GET = securityList
/securityDetails/:securityCode --> GET = securityDetails
/watchList --> GET = watcList
/addWatchList/:securityCode --> POST = added watchList






*/
