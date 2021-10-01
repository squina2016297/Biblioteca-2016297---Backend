'use strict'

var Bibliografia = require('../models/bibliografia.model');
var User = require('../models/user.model');

function prestarBibliografia(req, res){
    var bibliografiaID = req.params.idB;
    var userID = req.params.idU;

    User.findOne({numID: userID}, (err, userFound)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(userFound){
            if(userFound.prestados >= 10){
                res.send({message: 'No puedes prestar mas de 10 libros y/o revistas a la vez'})
            }else{
                Bibliografia.findById(bibliografiaID, (err, bibliografiaFound)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(bibliografiaFound){
                        User.findOne({numID: userID, bibliografias: bibliografiaID}, (err, bibliografiaFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(bibliografiaFind){
                                return res.send({message: 'No puedes prestar el mismo libro o revista'})
                            }else{
                                if(bibliografiaFound.disponibles == 0){
                                    return res.send({message: 'Este libro o revisa no posee copias disponibles por el momento'})
                                }else{
                                    User.findOneAndUpdate({numID: userID}, {$push:{bibliografias: bibliografiaFound._id, historial: bibliografiaFound._id}}, {new: true}, (err, userPush)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'});
                                        }else if(userPush){
                                            User.findOneAndUpdate({numID: userID}, {$inc:{prestados: +1}}, {new: true}, (err, userPush)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general'});
                                                }else if(userPush){
                                                    User.findOneAndUpdate({numID: userID}, {$inc:{totalPrestados: +1}}, {new: true}, (err, userPush)=>{
                                                        if(err){
                                                            return res.status(500).send({message: 'Error general'})
                                                        }else if(userPush){
                                                            Bibliografia.findByIdAndUpdate(bibliografiaID, {$inc:{disponibles: -1, cantPrestados: +1}}, {new: true}, (err, bibliografiaInc)=>{
                                                                if(err){
                                                                    return res.status(500).send({message: 'Error general'})
                                                                }else if(bibliografiaInc){
                                                                    return res.send({message: 'Préstamo realizado con éxito: ', userPush})
                                                                }else{
                                                                    return res.status(403).send({message: 'No se realizó el prestamo'})
                                                                }
                                                            })
                                                        }else{
                                                            return res.status(403).send({message: 'No se realizó el prestamo'})
                                                        }
                                                    }).populate('bibliografias').populate('historial')
                                                }else{
                                                    return res.status(403).send({message: 'No se actualizo la cantidad de libros o revistas prestados'});
                                                }
                                            }).populate('bibliografias').populate('historial')
                                        }else{
                                            return res.send({message: 'No se pudo realizar el prestamo'});
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        return res.status(404).send({message: 'No existe esa bibliografia'})
                    }
                })
            }
        }else{
            return res.send({message: 'El usuario no existe'})
        }
    })
}

function devolucion(req, res){
    var userID = req.params.idU;
    var bibliografiaID = req.params.idB;

    User.findOne({numID: userID}, (err, userFound)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(userFound){
            Bibliografia.findById(bibliografiaID, (err, bibliografiaFound)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(bibliografiaFound){
                    User.findOneAndUpdate({numID: userID, bibliografias: bibliografiaID}, {$pull:{bibliografias: bibliografiaID}}, {new: true}, (err, userPull)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'})
                        }else if(userPull){
                            User.findOneAndUpdate({numID: userID}, {$inc:{prestados: -1}}, {new: true}, (err, userPush)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'});
                                }else if(userPush){
                                    Bibliografia.findByIdAndUpdate(bibliografiaID, {$inc:{disponibles: +1}}, {new: true}, (err, bibliografiaInc)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'})
                                        }else if(bibliografiaInc){
                                            return res.send({message: 'Devolución exitosa ', userPush})
                                        }else{
                                            return res.status(403).send({message: 'No se realizó el prestamo'})
                                        }
                                    })
                                }else{
                                    return res.status(403).send({message: 'No se actualizo la cantidad de libros o revistas prestados'});
                                }
                            }).populate('bibliografias').populate('historial')
                        }else{
                            return res.status(403).send({message: 'No has prestado este libro'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe el libro o revista que buscas'})
                }
            })
        }else{
            return res.status(404).send({message: 'No existe el usuario con ese número de identificación'})
        }
    })
}

module.exports = {
    prestarBibliografia,
    devolucion
}