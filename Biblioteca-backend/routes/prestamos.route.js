'use strict'

var express = require('express')
var mdAuth = require('../middlewares/authenticated')
var prestamosController = require('../controllers/prestamos.controller')

var api = express.Router();

api.put('/prestarBibliografia/:idU/:idB', [mdAuth.ensureAuth], prestamosController.prestarBibliografia)
api.put('/devolucion/:idU/:idB', [mdAuth.ensureAuth], prestamosController.devolucion)

module.exports = api;