'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt')

function crearAdmin(req, res){
    let user = new User();
    User.findOne({username: 'adminpractica'}, (err, found)=>{
        if(err){
            console.log('Error al crear al usuario', err)
        }else if(found){
            console.log('Administrador ya creado')
        }else{
            user.password = 'adminpractica'
            user.rol = 'Admin'
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    console.log('Error al encriptar la contraseña', err)
                }else if(passwordHash){
                    user.username = 'adminpractica';
                    user.password = passwordHash;
    
                    user.save((err, userSaved)=>{
                        if(err){
                            console.log('Error al crear el administrador', err)
                        }else if(userSaved){
                            console.log('Administrador creado', userSaved)
                        }else{
                            console.log('Administrador no creado')
                        }
                    })
                }else{
                    console.log('No se creo el usuario')
                }
            })
        }
    })
}

function login(req, res){
    var params = req.body;
    
    if(params.username && params.password){
        User.findOne({username: params.username.toLowerCase()}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassowrd)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general en la verificación de la contraseña'});
                    }else if(checkPassowrd){
                        if(params.gettoken){
                            delete userFind.password
                            return res.send({ token: jwt.createToken(userFind), user: userFind});
                        }else{
                            return res.send({ message: 'Usuario logeado', user: userFind});
                        }
                    }else{
                    }
                    return res.status(401).send({message: 'Contraseña incorrecta'});
                })
            }else{
                return res.send({message: 'Username incorrecto o inexistente'});
            }
        }).populate('bibliografias').populate('historial')
    }else{
        return res.status(401).send({message: 'Porfavor, ingresa los datos completos'})
    }
}

function crearUser(req, res){
    var userId = req.params.idU;
    var user = new User();
    var params = req.body;
    var emailV=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var pass = /^.{5,12}$/
    var names = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var lastN = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var userN = /^[a-zA-Z0-9\_\-]{4,16}$/;
    var numCant = /^\d{7,13}$/;

    if(params.numID && params.nombre && params.apellido && params.username && params.password && params.rol){
        if(emailV.test(params.email)){
            if(pass.test(params.password)){
                if(numCant.test(params.numID)){
                    if(names.test(params.nombre)){
                        if(lastN.test(params.apellido)){
                            if(userN.test(params.username)){
                                User.findOne({username: params.username}, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error general en el servidor'});
                                        console.log(err);
                                    }else if(userFind){
                                        return res.send({message: 'Username ya existente'});
                                    }else{
                                        User.findOne({numID: params.numID}, (err, idFind)=>{
                                            if(err){
                                                res.status(500).send({message: 'Error general en el servidor'});
                                                console.log(err);
                                            }else if(idFind){
                                                return res.send({message: 'Usuario con ese CUI/carnet ya existente'});
                                            }else{
                                                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general en la encriptación'});
                                                    }else if(passwordHash){
                                                        user.numID = params.numID;
                                                        user.nombre = params.nombre;
                                                        user.apellido = params.apellido;
                                                        user.username = params.username;
                                                        user.password = passwordHash;
                                                        user.email = params.email.toLowerCase();
                                                        user.rol = params.rol;
                                                        user.prestados = 0;
                                                        user.totalPrestados = 0;
                    
                                                        user.save((err, userSaved)=>{
                                                            if(err){
                                                                return res.status(500).send({message: 'Error general al guardar'});
                                                            }else if(userSaved){
                                                                return res.send({message: 'Usuario guardado', userSaved});
                                                            }else{
                                                                return res.status(500).send({message: 'No se guardó el usuario'});
                                                            }
                                                        })
                                                    }else{
                                                        return res.status(401).send({message: 'Contraseña no encriptada'});
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }else{
                                return res.send({message: 'El username tiene que tener entre 4 a 16 caracteres. Solo se admiten Letras, numeros, guiones.'});
                            }
                        }else{
                            return res.send({message: 'Solo se admiten letras para los apellidos de la persona'});
                        }
                    }else{
                        return res.send({message: 'Solo se admiten letras para los nombres de la persona'});
                    }
                }else{
                    return res.send({message: 'El numero de indentificacion debe de contener entre 7 y 13 dígitos'});
                }
            }else{
                return res.send({message: 'La contraseña tiene que tener un mínimo de 5 a 12 caracteres'});
            }
        }else{
            return res.send({message: 'Correo electrónico inválido'});
        }
    }else{
        return res.send({message: 'Ingresa los datos completos'})
    }
}

function updateUser(req, res){
    let datos = req.body;
    let userID = req.params.id;
    var emailV=/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    var pass = /^.{5,12}$/
    var names = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var lastN = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var userN = /^[a-zA-Z0-9\_\-]{4,16}$/;
    var rols = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;

    User.findOne({numID: userID}, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al buscar usuario'});
        }else if(userFind){
            if(userFind.rol == "Admin"){
                return res.send({message: 'No se puede actualizar a un usuario adminisatrador'})
            }else{
                if(datos.username != userFind.username){
                    if(emailV.test(datos.email)){
                        if(names.test(datos.nombre)){
                            if(lastN.test(datos.apellido)){
                                if(rols.test(datos.rol)){
                                    User.findOne({username: datos.username.toLowerCase()}, (err, usernameFound)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general'})
                                        }else if(usernameFound){
                                            return res.send({message: 'Nombre de usuario ya existente'})
                                        }else{
                                            User.findOneAndUpdate({numID: userID}, datos, {new:true}, (err, userUpdated)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general al actualizar'});
                                                }else if(userUpdated){
                                                    User.findOneAndUpdate({numID: userID}, {username: datos.username.toLowerCase()}, {new: true}, (err, userUpdated)=>{
                                                        if(err){
                                                            return res.status(500).send({message: 'Error general al actualizar'});
                                                        }else if(userUpdated){
                                                            return res.send({message: 'Usuario actualizado con éxito: ', userUpdated});
                                                        }else{
                                                            return res.send({message: 'No se pudo actualizar el usuario'});
                                                        }
                                                    })
                                                }else{
                                                    return res.send({message: 'No se actualizaron datos'})
                                                }                       
                                            })
                                        }
                                    })
                                }else{
                                    return res.send({message: 'Solo se admiten letras para los roles de los usuarios'});
                                }
                            }else{
                                return res.send({message: 'Solo se admiten letras para los apellidos de la persona'});
                            }
                        }else{
                            return res.send({message: 'Solo se admiten letras para los nombres de la persona'});
                        }
                    }else{
                        return res.send({message: 'Correo electrónico inválido'});
                    }
                }else{
                    if(emailV.test(datos.email)){
                        if(names.test(datos.nombre)){
                            if(lastN.test(datos.apellido)){
                                if(rols.test(datos.rol)){
                                    User.findOneAndUpdate({numID: userID}, datos, {new:true}, (err, userUpdated)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general al actualizar'});
                                        }else if(userUpdated){
                                            return res.send({message: 'Usuario actualizado'})
                                        }else{
                                            return res.send({message: 'No se actualizaron datos'})
                                        }                       
                                    })
                                }else{
                                    return res.send({message: 'Solo se admiten letras para los roles de los usuarios'});
                                }
                            }else{
                                return res.send({message: 'Solo se admiten letras para los apellidos de la persona'});
                            }
                        }else{
                            return res.send({message: 'Solo se admiten letras para los nombres de la persona'});
                        }
                    }else{
                        return res.send({message: 'Correo electrónico inválido'});
                    }
                }
            }
        }else{
            return res.status(403).send({message: 'Usuario no encontrado'});
        }
    })
}

function removeUser(req, res){
    let userID = req.params.id;

    User.findOne({numID: userID}, (err, userFind)=>{
        if(err){
            return res.status(403).send({message: 'Error general en el servidor'})
        }else if(userFind){
            User.findOneAndRemove({numID: userID}, (err, userRemoved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al intentar eliminar'})
                }else if(userRemoved){
                    return res.send({message: 'Usuario eliminado con éxito', userRemoved})
                }else{
                    return res.status(403).send({message: 'Usuario no eliminado'});
                }
            })
        }else{
            return res.status(404).send({message: 'El usuario no existe o ya fué eliminado'})
        }
    })
}

function verUsuarios(req, res){
    User.find({}).sort({"numID":1}).exec((err, usersFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(usersFind){
            return res.send({message: 'Usuarios encontrados: ', usersFind})
        }else{
            return res.status(404).send({message: 'No se encontraron usuarios'})
        }
    })
}

function verUsuariosD(req, res){
    User.find({}).sort({"numID":-1}).exec((err, usersFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(usersFind){
            return res.send({message: 'Usuarios encontrados: ', usersFind})
        }else{
            return res.status(404).send({message: 'No se encontraron usuarios'})
        }
    })
}

function userHistorial(req, res){
    let userID = req.params.id
    User.findOne({numID: userID}, (err, user)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(user){
            return res.send({user})
        }else{
            return res.status(404).send({message: 'No se encontraron usuarios'})
        }
    }).populate('historial').populate('bibliografias')
}

function usersPrestamos(req, res){
    User.find({}).limit(5).sort({"totalPrestados":-1}).exec((err, usersFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(usersFind){
            return res.send({message: 'Usuarios encontrados: ', usersFind})
        }else{
            return res.status(404).send({message: 'No se encontraron usuarios'})
        }
    })
}

module.exports = {
    crearAdmin,
    login,
    crearUser,
    updateUser,
    removeUser,
    verUsuarios,
    verUsuariosD,
    userHistorial,
    usersPrestamos
}