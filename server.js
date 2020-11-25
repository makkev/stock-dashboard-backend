const express = require('express');
const bodyParser = require('body-parser');
const { securityList, eps, pe, watchList, growth } = require('./data');

const app = express();

app.use(bodyParser.json());
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
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json('success');
  } else {
    res.status(400).json('error logging in');
  }
  res.json('signin');
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
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

const getSecurityDetails = ({ value, date, source }) => ({
  value,
  date,
  source,
});

app.get('/securityDetails/:securityId', (req, res) => {
  const { securityId } = req.params;

  const securityDetails = {
    securityId,
    eps: getSecurityDetails(eps[securityId]),
    pe: getSecurityDetails(pe[securityId]),
  };
  res.json(securityDetails);
});

app.post('/addWatchList/:securityId', (req, res) => {
  const { securityId } = req.params;

  watchList[securityId] = {
    securityId,
    eps: eps[securityId],
    pe: pe[securityId],
    growth: growth[securityId],
  };
  res.json(watchList[securityId]);
});

app.get('/watchList', (req, res) => {
  res.json(watchList);
});

app.listen(3000);

/*

/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/securityList --> GET = securityList
/securityDetails/:securityId --> GET = securityDetails
/watchList --> GET = watcList
/addWatchList/:securityId --> POST = added watchList






*/
