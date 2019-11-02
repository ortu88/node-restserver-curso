const express = require('express');

const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario')

const app = express();

app.get('/usuario', function (req, res) {
    res.json('Get usuario');
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
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    } );

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({id});
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario');
});

module.exports = app;