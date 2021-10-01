'use strict'

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var userRoutes = require('./routes/user.route')
var bibliografiaRoutes = require('./routes/bibliografia.route')
var prestamosRoutes = require('./routes/prestamos.route')

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', bibliografiaRoutes);
app.use('/api', prestamosRoutes);


module.exports = app;