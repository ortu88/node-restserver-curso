const express = require('express');

const {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

const app = express();

const Categoria = require('../models/categoria');
const Usuario = require('../models/usuario');

//=========================
//Obtiene las categorias
//=========================
app.get('/categoria', verificaToken, async (req, res) => {
    try {
        const categorias = await Categoria.find({estado: true}).sort('descripcion').populate('usuario', 'nombre email');
        return res.json({
            ok: true,
            categorias,
            cuantos: categorias.length
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    
});

//=========================
//Obtiene una categoria
//=========================
app.get('/categoria/:id', verificaToken, async (req, res) => {
    const _id = req.params.id;

    try {
        const categoria = await Categoria.findById(_id).populate('usuario', 'nombre email');

        if(!categoria) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }

        return res.json({
            ok: true,
            categoria
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
    
});

//=========================
//Crear una categoria
//=========================
app.post('/categoria', [verificaToken, verificaAdminRole], async (req, res) => {
    const {descripcion, idUsuario} = req.body;

    let usuario;
    
    try {
        usuario = await Usuario.findById(idUsuario);
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    const categoria = new Categoria({
        descripcion,
        usuario,
        estado: true
    });

    try {
        await categoria.save();
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
    
    return res.json({
        ok: true,
        categoria
    });

});

//=========================
//Modificar una categoria
//=========================
app.put('/categoria', [verificaToken, verificaAdminRole], async (req, res) => {
    const {descripcion, estado, id} = req.body;

    let categoria;

    if(!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'No se informó el id de la categoria a modificar'
            }
        });
    }
    
    try {
        categoria = await Categoria.findByIdAndUpdate(id, {descripcion, estado}, {new: true, omitUndefined: true, runValidators: true});
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if(!categoria) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Categoría no encontrada'
            }
        });
    }

    return res.json({
        ok: true,
        message: 'Categoria Modificada',
        categoria
    });

});

//=========================
//Eliminar una categoria
//=========================
app.delete('/categoria', [verificaToken, verificaAdminRole], async (req, res) => {
    const {id} = req.body;

    if(!id) {
        return res.status(404).json({
            ok: false,
            err: {
                message: 'No se informó el id de la categoria a eliminar'
            }
        });
    }

    let categoria;
    
    try {
        categoria = await Categoria.findByIdAndRemove(id);
    } catch(err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if(!categoria) {
        return res.status(500).json({
            ok: false,
            err: {
                message: 'Categoría no encontrada'
            }
        });
    }

    return res.json({
        ok: true,
        message: 'Categoria Borrada',
        categoria
    });

});

module.exports = app;