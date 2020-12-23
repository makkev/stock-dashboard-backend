const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const fs = require('fs');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: '',
    password: '',
    database: 'stock-dashboard',
  },
});

// db.select('*')
//   .from('users')
//   .then(data => {
//     console.log(data);
//   });

const PEValue = require('./pe-value.utils');

const DCFValue = require('./dcf-value.utils');

const ROEValue = require('./roe-value.utils');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const { securityList, eps, pe, watchList, growth } = require('./data');
const EPS_FILE = '/Users/KM/git/web-scraping/data/out/eps.json';
const GROWTH_FILE = '/Users/KM/git/web-scraping/data/out/growth.json';
const PE_FILE = '/Users/KM/git/web-scraping/data/out/pe.json';
const PRICE_FILE = '/Users/KM/git/web-scraping/data/out/price.json';

const CASH_FILE = '/Users/KM/git/web-scraping/data/out/cash.json';
const TOTAL_LIABILITIES_FILE =
  '/Users/KM/git/web-scraping/data/out/total-liabilities.json';
const FREE_CASH_FILE =
  '/Users/KM/git/web-scraping/data/out/free-cash-flow.json';
const SHARES_OUTSTANDING_FILE =
  '/Users/KM/git/web-scraping/data/out/shares-outstanding.json';

const SHAREHOLDERS_EQUITY_FILE =
  '/Users/KM/git/web-scraping/data/out/shareholders-equity.json';
const ROE_FILE = '/Users/KM/git/web-scraping/data/out/roe.json';
const DIVIDEND_FILE = '/Users/KM/git/web-scraping/data/out/dividend.json';

const MARGIN_OF_SAFETY = 25; // percent
const DISCOUNT_RATE = 2; // percent
const NUMBER_OF_YEARS = 5;
const GROWTH_DECLINE_RATE = 5;

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

  db('users')
    .returning('*')
    .insert({
      email,
      name,
      joined: new Date(),
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(err => res.status(400).json('unable to register'));
});

app.get('/securityList', (req, res) => {
  res.json(securityList);
});

const getSecurityDetails = securityCode => {
  const epsData = JSON.parse(fs.readFileSync(EPS_FILE));
  const growthData = JSON.parse(fs.readFileSync(GROWTH_FILE));
  const peData = JSON.parse(fs.readFileSync(PE_FILE));
  const priceData = JSON.parse(fs.readFileSync(PRICE_FILE));

  // expectedGrowthRate,
  // marginOfSafety,
  // growthDeclineRate,
  // discountRate,
  // FCFMultiplierYears,
  // numberOfYears;

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

const convertNum = num => {
  const convert = {
    K: Number(num.replace('K', '')) * 1000,
    M: Number(num.replace('M', '')) * 1000000,
    B: Number(num.replace('B', '')) * 1000000000,
  };
  return convert[num.substring(num.length - 1, num.length)];
};

const getDCF = securityCode => {
  const cash = JSON.parse(fs.readFileSync(CASH_FILE));
  const totalLiabilities = JSON.parse(fs.readFileSync(TOTAL_LIABILITIES_FILE));
  const freeCashFlow = JSON.parse(fs.readFileSync(FREE_CASH_FILE));
  const sharesOutstanding = JSON.parse(
    fs.readFileSync(SHARES_OUTSTANDING_FILE)
  );
  const growthData = JSON.parse(fs.readFileSync(GROWTH_FILE));

  return {
    securityCode,
    cash: {
      ...cash[securityCode],
      value: Number(cash[securityCode].value.replace(/,/g, '') * 1000),
    },
    totalLiabilities: {
      ...totalLiabilities[securityCode],
      value: Number(
        totalLiabilities[securityCode].value.replace(/,/g, '') * 1000
      ),
    },
    freeCashFlow: {
      ...freeCashFlow[securityCode],
      value: Number(freeCashFlow[securityCode].value.replace(/,/g, '') * 1000),
    },
    sharesOutstanding: {
      ...sharesOutstanding[securityCode],
      value: convertNum(sharesOutstanding[securityCode].value),
    },
    growthData: {
      ...growthData[securityCode],
      value: Number(growthData[securityCode].value.replace(/%/g, '')),
    },
    dcfCalc: DCFValue(
      Number(cash[securityCode].value.replace(/,/g, '') * 1000),
      Number(totalLiabilities[securityCode].value.replace(/,/g, '') * 1000),
      Number(freeCashFlow[securityCode].value.replace(/,/g, '') * 1000),
      convertNum(sharesOutstanding[securityCode].value),
      Number(growthData[securityCode].value.replace(/%/g, '')),
      MARGIN_OF_SAFETY,
      GROWTH_DECLINE_RATE,
      DISCOUNT_RATE,
      12,
      10
    ),
  };
};

const getROE = securityCode => {
  const shareholdersEquity = JSON.parse(
    fs.readFileSync(SHAREHOLDERS_EQUITY_FILE)
  );
  const roe = JSON.parse(fs.readFileSync(ROE_FILE));
  const sharesOutstanding = JSON.parse(
    fs.readFileSync(SHARES_OUTSTANDING_FILE)
  );
  const dividend = JSON.parse(fs.readFileSync(DIVIDEND_FILE));
  const growthData = JSON.parse(fs.readFileSync(GROWTH_FILE));

  return {
    securityCode,
    shareholdersEquity: {
      ...shareholdersEquity[securityCode],
      value: Number(
        shareholdersEquity[securityCode].value.replace(/,/g, '') * 1000
      ),
    },
    roe: {
      ...roe[securityCode],
      value: roe[securityCode].value,
    },
    sharesOutstanding: {
      ...sharesOutstanding[securityCode],
      value: convertNum(sharesOutstanding[securityCode].value),
    },
    dividend: {
      ...dividend[securityCode],
      value: Number(dividend[securityCode].value),
    },
    roeCalc: ROEValue(
      Number(shareholdersEquity[securityCode].value.replace(/,/g, '') * 1000),
      Number(roe[securityCode].value),
      convertNum(sharesOutstanding[securityCode].value),
      Number(dividend[securityCode].value),
      Number(growthData[securityCode].value.replace(/%/g, '')),
      MARGIN_OF_SAFETY,
      DISCOUNT_RATE,
      10
    ),
  };
};

app.get('/securityDetails/:securityCode', (req, res) => {
  const { securityCode } = req.params;
  res.json(getSecurityDetails(securityCode));
});

app.get('/getDCF/:securityCode', (req, res) => {
  const { securityCode } = req.params;
  res.json(getDCF(securityCode));
});

app.get('/getROE/:securityCode', (req, res) => {
  const { securityCode } = req.params;
  res.json(getROE(securityCode));
});

app.post('/addWatchList/:securitycode', (req, res) => {
  const { email } = req.body;
  const { securitycode } = req.params;

  db('watchlist')
    .returning('*')
    .insert({
      email,
      securitycode,
    })
    .then(data => {
      res.json(data[0]);
    })
    .catch(err => res.status(400).json('unable to add watchlist'));
});

app.post('/watchList', (req, res) => {
  const { email } = req.body;

  db('watchlist')
    .select('securitycode')
    .where({
      email,
    })
    .then(data => res.json(data.map(rec => rec.securitycode)))
    .catch(err => res.status(400).json('unable to get watchlist'));
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
