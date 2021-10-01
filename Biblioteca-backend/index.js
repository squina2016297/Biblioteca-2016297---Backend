'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var userController = require('./controllers/user.controller')
var port = 3200;

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/Biblioteca-BD', {useNewUrlParser: true, useFindAndModify: true})
    .then(()=>{
        console.log('Conectado a la Base de datos');
        userController.crearAdmin();
        app.listen(port, ()=>{
            console.log('Servidor de express corriendo')
        })
    })
    .catch((err)=>{console.log('Error al tratar de conectarse al servidor de express')})