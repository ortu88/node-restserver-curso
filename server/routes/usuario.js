const express = require('express');

const _ = require('underscore');

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario')

const app = express();


app.get('/usuario', function (req, res) {

    let desde = Number(req.query.desde) || 0;

    let limite = Number(req.query.limite) || 5;

    Usuario.find({estado: true}, 'nombre email')
    .skip(desde)
    .limit(limite)
    .exec((err, usuarios) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // Usuario.count({}, (err, cuantos) => {
            
        //     res.json({
        //         ok: true,
        //         usuarios,
        //         cuantos
        //     });

        // });

            return res.json({
                ok: true,
                usuarios,
                cuantos: usuarios.length
            });

    });

});

app.post('/usuario', function (req, res) {
    let { body: persona } = req;

    let usuario = new Usuario({
        nombre: persona.nombre,
        email: persona.email,
        password: bcrypt.hashSync(persona.password, 10),
        role: persona.role
    });

    usuario.save( (err, usuarioDB) => {
        if(err) {
            return  res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    } );

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    
});

app.delete('/usuario/:id', function (req, res) {
    
    let {id} = req.params;
    let body = {estado: false};

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true, useFindAndModify: false}, (err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: 'Usuario no existe'
            });
        }

        return res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

module.exports = app;