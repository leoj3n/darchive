const express = require('express');
const enforce = require('express-sslify');

const app = express();
const port = process.env.PORT || 5000;

function allowCrossDomain (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(allowCrossDomain);
app.use('/', express.static(`${__dirname}/public`));

app.listen(port, async (err) => {
  if (err) {
    console.error('app.listen failed', err);
  }

  console.log(`App running at: http://localhost:${port}`);
});
