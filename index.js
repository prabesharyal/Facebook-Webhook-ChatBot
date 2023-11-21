const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(bodyParser.json());
app.use(require('./src/routers/index.router'));

app.listen(8080, () => {
   console.log('Server is running on port 8080!');
});
