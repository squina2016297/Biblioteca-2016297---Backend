'use strict'

var express = require('express')
var userController = require('../controllers/user.controller')
var mdAuth = require('../middlewares/authenticated')

var api = express.Router();

api.post('/login', userController.login)
api.post('/crearUser', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.crearUser);
api.put('/updateUser/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.updateUser)
api.delete('/removeUser/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.removeUser)
api.get('/verUsuarios', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.verUsuarios)
api.get('/verUsuariosD', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.verUsuariosD)
api.get('/userHistorial/:id', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.userHistorial)
api.get('/usersPrestamos', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.usersPrestamos)

module.exports = api;