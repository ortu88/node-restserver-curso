const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');
const _ = require('underscore');
const { response } = require('./usuario');

const app = express();

//================================
//Obteber productos paginado
//================================
app.get('/productos', verificaToken, async (req, res) => {
    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    try {
        const productos = await Producto.find({disponible: true})
                                    .skip(desde)
                                    .limit(limite)
                                    .populate({
                                        path: 'categoria',
                                        select: 'descripcion usuario',
                                        populate: {
                                            path: 'usuario',
                                            select: 'nombre email'
                                        }
                                    })
                                    .populate('usuario', 'nombre email');
        return res.json({
            ok: true,
            productos
        });
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

});

//================================
//Obteber producto por ID
//================================
app.get('/productos/:id', verificaToken, async (req, res) => {

    const id = req.params.id;

    if(!id) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'No se informa el ID'
            }
        });
    }

    try {
        const producto = await Producto.findById(id)
                                        .populate({
                                            path: 'categoria',
                                            select: 'descripcion usuario',
                                            populate: {
                                                path: 'usuario',
                                                select: 'nombre email'
                                            }
                                        })
                                        .populate('usuario', 'nombre email');
        return res.json({
            ok: true,
            producto
        });
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

});

//================================
//Buscar producto
//================================
app.get('/productos/buscar/:termino', verificaToken, async (req, res) => {

    const termino = req.params.termino;

    const regex = new RegExp(termino, 'i');

    try {
        const productos = await Producto.find({nombre: regex})
                                .populate('categoria', 'nombre');
        return res.json({
            ok: true,
            productos
        })
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

});

//================================
//Crear producto
//================================
app.post('/productos', verificaToken, async (req, res) => {

    const body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);

    let usuario;
    let categoria;
    try {
        usuario = await Usuario.findById(body.usuario);
        if(!usuario) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe el usuario'
                }
            });
        }
    } catch(err) {
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener usuario',
            err
        });
    }

    try {
        categoria = await Categoria.findById(body.categoria).populate('usuario', 'nombre email');
        if(!categoria) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'No existe la categoria'
                }
            });
        }
    } catch(err) {
        return res.status(500).json({
            ok: false,
            message: 'Error al obtener categoria',
            err
        });
    }

    body.categoria = categoria;
    body.usuario = usuario;

    let producto;
    try {
        producto = new Producto(body);
        await producto.save();
    } catch(err) {
        return res.status(500).json({
            ok: false,
            message: 'Error al crear producto',
            err
        });
    }

    return res.json({
            ok: true,
            producto
        });


});

//================================
//Actualizar producto por ID
//================================
app.put('/productos/:id', verificaToken, async (req, res) => {

    const _id = req.params.id;

    if(!_id) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'No se informa el ID'
            }
        });
    }

    const body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria']);

    let producto;
    
    try {
        producto = await Producto.findByIdAndUpdate(_id, body, {new: true, runValidators: true, omitUndefined: true})
                                .populate({
                                    path: 'categoria',
                                    select: 'descripcion usuario',
                                    populate: {
                                        path: 'usuario',
                                        select: 'nombre email'
                                    }
                                })
                                .populate('usuario', 'nombre email');
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: 'Error al actualizar producto',
            err
        });
    }

    return res.json({
        ok: true,
        message: 'Producto actualizado',
        producto
    });

});

//================================
//Borrar producto por ID
//================================
app.delete('/productos/:id', verificaToken, async (req, res) => {
    const _id = req.params.id;

    if(!_id) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'No se informa el ID'
            }
        });
    }

    let producto;
    
    try {
        producto = await Producto.findByIdAndUpdate(_id, {disponible: false}, {new: true, runValidators: true})
                                            .populate({
                                                path: 'categoria',
                                                select: 'descripcion usuario',
                                                populate: {
                                                    path: 'usuario',
                                                    select: 'nombre email'
                                                }
                                            })
                                            .populate('usuario', 'nombre email');
    } catch (err) {
        return res.status(500).json({
            ok: false,
            message: 'Error al desactivar producto',
            err
        });
    }

    return res.json({
        ok: true,
        message: 'Producto desactivado',
        producto
    });

});

module.exports = app;