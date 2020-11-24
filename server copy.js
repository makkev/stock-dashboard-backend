const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/:id', (req, res) => {
  // console.log(req.query);
  // req.body
  // console.log(req.headers);
  console.log(req.params);
  res.status(404).send('not found');
  // res.send('route: /');
});

app.get('/profile', (req, res) => {
  res.send('route: /profile');
});

app.post('/profile', (req, res) => {
  console.log(req.body);
  // add post data from req.body into db here
  res.send('success');
});

app.listen(3000);
