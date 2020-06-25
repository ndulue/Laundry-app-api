var express = require('express')
var router = express.Router();
const saltRounds = 8;
var moment = require('moment');
var bcrypt = require('bcrypt');


router.get('/', function(req, res, next) {
    res.send('Hello');
});
