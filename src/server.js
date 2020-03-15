require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const apiRouter = require('./api/router');

app.use(
  cors({
    origin: /http(?:s?):\/\/(?:localhost|[a-z-]+\.lipsumar\.io)(?::\d+|)/,
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, '../build')));
app.use('/previews', express.static(path.join(__dirname, '../previews')));
app.use('/api', apiRouter);
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
