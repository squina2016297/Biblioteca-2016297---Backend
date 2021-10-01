'use strict'

var express = require('express')
var mdAuth = require('../middlewares/authenticated')
var bibliografiaController = require('../controllers/bibliografia.controller')

var api = express.Router();

api.post('/addBibliografia', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bibliografiaController.addBibliografia)
api.post('/addRevista', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bibliografiaController.addRevista)
api.get('/buscarPalabras', [mdAuth.ensureAuth], bibliografiaController.buscarPalabras)
api.get('/buscarTemas', [mdAuth.ensureAuth], bibliografiaController.buscarTemas)
api.put('/editarLibro/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bibliografiaController.editarLibro)
api.put('/editarRevista/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bibliografiaController.editarRevista)
api.get('/verBibliografias', [mdAuth.ensureAuth], bibliografiaController.verBibliografias)
api.put('/deleteBibliografia/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], bibliografiaController.deleteBibliografia)
api.put('/vistas/:id', [mdAuth.ensureAuth], bibliografiaController.vistas)

api.get('/librosMasPrestados', [mdAuth.ensureAuth], bibliografiaController.librosMasPrestados)
api.get('/revistasMasPrestadas', [mdAuth.ensureAuth], bibliografiaController.revistasMasPrestadas)
api.get('/librosMasVistos', [mdAuth.ensureAuth], bibliografiaController.librosMasVistos)
api.get('/revistasMasVistas', [mdAuth.ensureAuth], bibliografiaController.revistasMasVistas)
api.get('/librosA', [mdAuth.ensureAuth], bibliografiaController.librosA)
api.get('/librosD', [mdAuth.ensureAuth], bibliografiaController.librosD)
api.get('/revistasA', [mdAuth.ensureAuth], bibliografiaController.revistasA)
api.get('/revistasD', [mdAuth.ensureAuth], bibliografiaController.revistasD)
api.get('/revistasCopiasA', [mdAuth.ensureAuth], bibliografiaController.revistasCopiasA)
api.get('/revistasCopiasD', [mdAuth.ensureAuth], bibliografiaController.revistasCopiasD)
api.get('/librosCopiasA', [mdAuth.ensureAuth], bibliografiaController.librosCopiasA)
api.get('/librosCopiasD', [mdAuth.ensureAuth], bibliografiaController.librosCopiasD)
api.get('/librosDisponiblesA', [mdAuth.ensureAuth], bibliografiaController.librosDisponiblesA)
api.get('/librosDisponiblesD', [mdAuth.ensureAuth], bibliografiaController.librosDisponiblesD)
api.get('/revistasDisponiblesA', [mdAuth.ensureAuth], bibliografiaController.revistasDisponiblesA)
api.get('/revistasDisponiblesD', [mdAuth.ensureAuth], bibliografiaController.revistasDisponiblesD)

module.exports = api;