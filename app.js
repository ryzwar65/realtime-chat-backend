const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const routes = require('./src/routes')
require('dotenv').config()

app.use(express());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use('/api/v1',routes)

app.listen(5000,()=>{
  console.log("RUNNING SERVER at 5000")
})