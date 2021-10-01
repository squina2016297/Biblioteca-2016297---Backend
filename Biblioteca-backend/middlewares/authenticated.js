'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretKey = 'encriptacion-2016297';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(403).send({message: 'La peticion no lleva cabecera de autenticacion'})
    }else{
        var token = req.headers.authorization.replace(/['"']+/g, '');
        try{
            var payload = jwt.decode(token, secretKey);
            if(payload.exp <= moment().unix()){
                return res.status(401).send({message: 'Token expirado'})
            }
        }catch(err){
            return res.status(404).send({message: 'Token invalido'})
        }

        req.user = payload;
        next();
    }
}

exports.ensureAuthAdmin = (req, res, next)=>{
    var payload = req.user;

    if(payload.rol != 'Admin'){
        return res.status(404).send({message: 'No tienes permisos para realizar esta accion'})
    }else{
        return next();
    }
}