'use strict'

var Bibliografia = require('../models/bibliografia.model')
var User = require('../models/user.model')

function addBibliografia(req, res){
    var bibliografia = new Bibliografia();
    var params = req.body;

    var autorV = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var tituloV = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var copiasV = /^\d+$/;
    var edicionV = /^\d+$/;
    var ejemplarV = /^\d+$/;
    var palabras = /[^,\s?]+/g;

        if(params.autor && params.titulo && params.edicion && params.descripcion && params.copias && params.palabrasClave && params.temas){
            if(copiasV.test(params.copias)){
                if(edicionV.test(params.edicion)){
                    if(palabras.test(params.palabrasClave)){
                        Bibliografia.findOne({titulo: params.titulo}, (err, bibliografiaFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general en el servidor'});
                            }else if(bibliografiaFind){
                                return res.send({message: 'Libro ya existente'})
                            }else{
                                bibliografia.tipo = "Libro";
                                bibliografia.autor = params.autor;
                                bibliografia.titulo = params.titulo;
                                bibliografia.edicion = params.edicion;
                                bibliografia.descripcion = params.descripcion;
                                bibliografia.copias = params.copias;
                                bibliografia.disponibles = params.copias;
                                bibliografia.palabrasClave = params.palabrasClave.split(" ");
                                bibliografia.temas = params.temas.split(" ");
                                bibliografia.cantPrestados = 0;
                
                                bibliografia.save((err, bibliografiaSaved)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general al guardar'})
                                    }else if(bibliografiaSaved){
                                        return res.send({message: 'Libro guardado', bibliografiaSaved})
                                    }else{  
                                        return res.status(403).send({message: 'No se guardó el libro'})
                                    }
                                })
                            }
                        })
                    }else{
                        return res.send({message: 'Ingresa una candena de palabras del formato correcto'})
                    }
                }else{
                    return res.send({message: 'Ingresar un numero de Edición válido'})
                }
            }else{
                return res.send({message: 'Ingresar un numero de copias válido'})
            }
        }else{
            return res.send({message: 'Llena todos los campos'})
        }

}

function addRevista(req, res){
    var bibliografia = new Bibliografia();
    var params = req.body;

    var autorV = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var tituloV = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
    var copiasV = /^\d+$/;
    var edicionV = /^\d+$/;
    var ejemplarV = /^\d+$/;

    if(params.autor && params.titulo && params.edicion && params.descripcion && params.copias && params.palabrasClave && params.temas && params.frecuencia && params.ejemplar){
        if(copiasV.test(params.copias)){
            if(ejemplarV.test(params.ejemplar)){
                if(edicionV.test(params.edicion)){
                    Bibliografia.findOne({titulo: params.titulo}, (err, bibliografiaFind)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general en el servidor'});
                        }else if(bibliografiaFind){
                            return res.send({message: 'Revista ya existente'})
                        }else{
                            bibliografia.tipo = "Revista";
                            bibliografia.autor = params.autor;
                            bibliografia.titulo = params.titulo;
                            bibliografia.edicion = params.edicion;
                            bibliografia.descripcion = params.descripcion;
                            bibliografia.copias = params.copias;
                            bibliografia.disponibles = params.copias;
                            bibliografia.palabrasClave = params.palabrasClave.split(" ");
                            bibliografia.temas = params.temas.split(" ");
                            bibliografia.frecuencia = params.frecuencia;
                            bibliografia.ejemplar = params.ejemplar;
                            bibliografia.catPrestados = 0;
            
                            bibliografia.save((err, bibliografiaSaved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al guardar'})
                                }else if(bibliografiaSaved){
                                    return res.send({message: 'Revista guardada', bibliografiaSaved})
                                }else{  
                                    return res.status(403).send({message: 'No se guardó la revista'})
                                }
                            })
                        }
                    })
                }else{
                    return res.send({message: 'Ingresar un numero de Edición válido'})
                }
            }else{
                return res.send({message: 'Ingresa un numero valido para el ejemplar de la revista'})
            }
        }else{
            return res.send({message: 'Ingresa un numero valido de copias'})
        }
    }else{
        return res.send({message: 'Llena todos los campos'})
    }
}

function buscarPalabras(req, res){
    var params = req.body;

    Bibliografia.find({palabrasClave: params.palabrasClave}, (err, bibliografiaFound)=>{
        if(err){
            return res.status(403).send({message: 'Error general al buscar'})
        }else if(bibliografiaFound){
            return res.send({message: 'Coincidencias: ', bibliografiaFound})
        }else{
            return res.status(404).send({message: 'No se encontraron coincidencias'})
        }
    })
}

function buscarTemas(req, res){
    var params = req.body;

    Bibliografia.find({temas: params.temas}, (err, bibliografiaFound)=>{
        if(err){
            return res.status(403).send({message: 'Error general al buscar'})
        }else if(bibliografiaFound){
            return res.send({message: 'Coincidencias: ', bibliografiaFound})
        }else{
            return res.status(404).send({message: 'No se encontraron coincidencias'})
        }
    })
}

function editarLibro(req, res){
    var bibliografiaID = req.params.id;
    var datos = req.body;
    var copiasV = /^\d+$/;
    var edicionV = /^\d+$/;
    var palabras = /[^,\s?]+/g;

    Bibliografia.findOne({_id: bibliografiaID}, (err, bibliografiaFound)=>{
        if(err){
            return res.status(500).send({messag: 'Error general al buscar'})
        }else if(bibliografiaFound){
            if(datos.titulo != bibliografiaFound.titulo){
                if(copiasV.test(datos.copias)){
                    if(edicionV.test(datos.edicion)){
                        Bibliografia.findOne({titulo: datos.titulo}, (err, bibliografiaFind)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(bibliografiaFind){
                                return res.send({message: 'Titulo ya existente'})
                            }else{
                                Bibliografia.findByIdAndUpdate(bibliografiaID, datos, {new: true}, (err, bibliografiaUpdated)=>{
                                    if(err){
                                        return res.status(500).send({messag: 'Error general'})
                                    }else if(bibliografiaUpdated){
                                        Bibliografia.findByIdAndUpdate(bibliografiaID, {disponibles: datos.copias}, {new: true}, (err, bibliografiaUpdated)=>{
                                            if(err){
                                                return res.status(500).send({messag: 'Error general'})
                                            }else if(bibliografiaUpdated){
                                                return res.send({message: "Libro actualizado", bibliografiaUpdated})
                                            }else{
                                                return res.status(403).send({message: 'No se actualizo el libro o revista'})
                                            }
                                        })
                                    }else{
                                        return res.status(403).send({message: 'No se actualizo el libro o revista'})
                                    }
                                })
                            }
                        })
                    }else{
                        return res.send({message: 'Ingresar un numero de Edición válido'})
                    }
                }else{
                    return res.send({message: 'Ingresa un numero valido de copiasss'})
                }
            }else{
                if(copiasV.test(datos.copias)){
                    if(edicionV.test(datos.edicion)){
                        Bibliografia.findByIdAndUpdate(bibliografiaID, datos, {new: true}, (err, bibliografiaUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general'})
                            }else if(bibliografiaUpdated){
                                Bibliografia.findByIdAndUpdate(bibliografiaID, {disponibles: datos.copias}, {new: true}, (err, bibliografiaUpdated)=>{
                                    if(err){
                                        return res.status(500).send({messag: 'Error general'})
                                    }else if(bibliografiaUpdated){
                                        return res.send({message: "Libro actualizado", bibliografiaUpdated})
                                    }else{
                                        return res.status(403).send({message: 'No se actualizo el libro o revista'})
                                    }
                                })
                            }else{
                                return res.status(403).send({message: 'No se actualizo el libro o revista'})
                            }
                        })
                    }else{
                        return res.send({message: 'Ingresar un numero de Edición válido'})
                    }
                }else{
                    return res.send({message: 'Ingresa un numero valido de copias'})
                }
            }
        }else{
            return res.status(404).send({message: 'Libro o revista inexistente'})
        }
    })
}

function editarRevista(req, res){
    var bibliografiaID = req.params.id;
    var datos = req.body;
    var copiasV = /^\d+$/;
    var ejemplarV = /^\d+$/;
    var edicionV = /^\d+$/;

    Bibliografia.findOne({_id: bibliografiaID}, (err, bibliografiaFound)=>{
        if(err){
            return res.status(500).send({messag: 'Error general al buscar'})
        }else if(bibliografiaFound){
            if(datos.titulo != bibliografiaFound.titulo){
                if(copiasV.test(datos.copias)){
                    if(edicionV.test(datos.edicion)){
                        if(ejemplarV.test(datos.ejemplar)){
                            Bibliografia.findOne({titulo: datos.titulo}, (err, bibliografiaFind)=>{
                                if(err){
                                    return res.status(500).send({messag: 'Error general'})
                                }else if(bibliografiaFind){
                                    return res.send({message: 'Titulo ya existente'})
                                }else{
                                    Bibliografia.findByIdAndUpdate(bibliografiaID, datos, {new: true}, (err, bibliografiaUpdated)=>{
                                        if(err){
                                            return res.status(500).send({messag: 'Error general'})
                                        }else if(bibliografiaUpdated){
                                            return res.send({message: "Libro actualizado", bibliografiaUpdated})
                                        }else{
                                            return res.status(403).send({message: 'No se actualizo el libro o revista'})
                                        }
                                    })
                                }
                            })
                        }else{
                            return res.send({message: 'Ingresa un numero de ejemplar válido'})
                        }
                    }else{
                        return res.send({message: 'Ingresar un numero de Edición válido'})
                    }
                }else{
                    return res.send({message: 'Ingresa un numero valido de copias'})
                }
            }else{
                if(copiasV.test(datos.copias)){
                    if(edicionV.test(datos.edicion)){
                        if(ejemplarV.test(datos.ejemplar)){
                            Bibliografia.findByIdAndUpdate(bibliografiaID, datos, {new: true}, (err, bibliografiaUpdated)=>{
                                if(err){
                                    return res.status(500).send({messag: 'Error general'})
                                }else if(bibliografiaUpdated){
                                    return res.send({message: "Libro actualizado", bibliografiaUpdated})
                                }else{
                                    return res.status(403).send({message: 'No se actualizo el libro o revista'})
                                }
                            })
                        }else{
                            return res.send({message: 'Ingresa un numero de ejemplar válido'})
                        }
                    }else{
                        return res.send({message: 'Ingresar un numero de Edición válido'})
                    }
                }else{
                    return res.send({message: 'Ingresa un numero valido de copias'})
                }
            }
        }else{
            return res.status(404).send({message: 'Libro o revista inexistente'})
        }
    })
}

function deleteBibliografia(req, res){
    let biblioID = req.params.id

    Bibliografia.findById(biblioID, (err, biblioFound)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(biblioFound){
            User.updateMany({bibliografias: biblioID}, {$inc:{prestados: -1}}, {new: true}, (err, userPush)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(userPush){
                    User.updateMany({bibliografias: biblioID}, {$pull:{bibliografias: biblioID}}, {new: true},(err, userPull)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general'})
                        }else if(userPull){
                            Bibliografia.findByIdAndRemove(biblioID, (err, biblioRemoved)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general'})
                                }else if(biblioRemoved){
                                    return res.send({message: 'Bibliografia eliminada', biblioFound})
                                }else{
                                    return res.status(404).send({message: "No se elimino la bibliografia"})
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'No se actualizó el usuario'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'No se actualizo la cantidad de libros o revistas prestados'});
                }
            }).populate('bibliografias').populate('historial')
        }else{
            return res.status(404).send({message: "Bibliografia no encontrada"})
        }
    })
}

function verBibliografias(req, res){
    Bibliografia.find({}).sort({"titulo":1}).exec((err, bibliografias)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(bibliografias){
            return res.send({message: 'Bibliografias encontradas: ', bibliografias})
        }else{
            return res.status(404).send({message: 'No se encontraron bibliografias'})
        }
    })
}

function vistas(req, res){

    let biblioID = req.params.id;
    
    Bibliografia.findByIdAndUpdate(biblioID, {$inc:{cantVistas: +1}}, {new: true}, (err, biblioUpdated)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(biblioUpdated){
            return res.send({biblioUpdated})
        }else{
            return res.status(404).send({message: 'No se encontró la bibliografía que buscas'})
        }
    })
}

function librosMasPrestados(req, res){
    Bibliografia.find({tipo: "Libro"}).limit(5).sort({"cantPrestados":-1}).exec((err, librosPrestados)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(librosPrestados){
            return res.send({message: 'Libros encontrados: ', librosPrestados})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function librosMasVistos(req, res){
    Bibliografia.find({tipo: "Libro"}).limit(5).sort({"cantVistas":-1}).exec((err, librosVistos)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(librosVistos){
            return res.send({message: 'Libros encontrados: ', librosVistos})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function revistasMasPrestadas(req, res){
    Bibliografia.find({tipo: "Revista"}).limit(5).sort({"cantPrestados":-1}).exec((err, revistasPrestadas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(revistasPrestadas){
            return res.send({message: 'Revistas encontradas: ', revistasPrestadas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function revistasMasVistas(req, res){
    Bibliografia.find({tipo: "Revista"}).limit(5).sort({"cantVistas":-1}).exec((err, revistasVistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistasVistas){
            return res.send({message: 'Revistas encontradas: ', revistasVistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function librosA(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"titulo": 1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function revistasA(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"titulo":1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function librosD(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"titulo": -1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function librosCopiasA(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"copias": 1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function librosDisponiblesA(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"disponibles": 1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function librosDisponiblesD(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"disponibles": -1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function librosCopiasD(req, res){
    Bibliografia.find({tipo: "Libro"}).sort({"copias": -1}).exec((err, libros)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(libros){
            return res.send({message: 'Libros encontradas: ', libros})
        }else{
            return res.status(404).send({message: 'No se encontraron libros'})
        }
    })
}

function revistasD(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"titulo": -1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar usuarios'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function revistasCopiasA(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"copias": 1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function revistasCopiasD(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"copias": -1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function revistasDisponiblesA(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"disponibles": 1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

function revistasDisponiblesD(req, res){
    Bibliografia.find({tipo: "Revista"}).sort({"disponibles": -1}).exec((err, revistas)=>{
        if(err){
            return res.status(500).send({message: 'Error general al intentar buscar'})
        }else if(revistas){
            return res.send({message: 'Revistas encontradas: ', revistas})
        }else{
            return res.status(404).send({message: 'No se encontraron revistas'})
        }
    })
}

module.exports = {
    addBibliografia,
    buscarPalabras,
    buscarTemas,
    editarLibro,
    addRevista,
    verBibliografias,
    editarRevista,
    deleteBibliografia,
    vistas,
    librosMasPrestados,
    revistasMasPrestadas,
    librosMasVistos,
    revistasMasVistas,
    librosA,
    librosD,
    librosCopiasA,
    librosCopiasD,
    librosDisponiblesA,
    librosDisponiblesD,
    revistasA,
    revistasD,
    revistasCopiasA,
    revistasCopiasD,
    revistasDisponiblesA,
    revistasDisponiblesD
}