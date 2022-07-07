const express = require("express");
const app = express();
const socket = require("socket.io");
const cors = require('cors')

app.use(express());

app.use(cors());

var server = app.listen(5000)