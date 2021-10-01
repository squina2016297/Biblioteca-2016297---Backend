'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    numID: Number,
    nombre: String,
    apellido: String,
    username: String,
    password: String,
    email: String,
    rol: String,
    bibliografias: [{type: Schema.ObjectId, ref: 'bibliografia'}],
    historial: [{type: Schema.ObjectId, ref: 'bibliografia'}],
    prestados: Number,
    totalPrestados: Number
})

module.exports = mongoose.model('user', userSchema);