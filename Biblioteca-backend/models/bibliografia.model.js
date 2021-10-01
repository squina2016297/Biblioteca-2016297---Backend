'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bibliografiaSchema = Schema({
    tipo: String,
    autor: String,
    titulo: String,
    edicion: Number,
    descripcion: String,
    copias: Number,
    disponibles: Number,
    palabrasClave: [],
    temas: [],
    frecuencia: String,
    ejemplar: Number,
    cantPrestados: Number,
    cantVistas: Number,
})

module.exports = mongoose.model('bibliografia', bibliografiaSchema);