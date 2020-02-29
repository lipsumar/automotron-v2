const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const apiRouter = require('./api/router');

app.use(express.static(path.join(__dirname, '../build')));
app.use('/api', apiRouter);
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
