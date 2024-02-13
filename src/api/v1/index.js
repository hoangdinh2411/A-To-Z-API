const express = require('express');
const app = express();

require('./routers')(app);

module.exports = app;
