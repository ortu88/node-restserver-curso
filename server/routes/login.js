const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const app = express();

app.post('/login', (req, res) => {

    const body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        if(!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o contraseña incorrectos'
                }
            });
        }

        const token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });

});

app.post('/google', async (req, res) => {
    const idtoken = req.body.idtoken;

    let response;

    try {
        const ticket = await client.verifyIdToken({
            idToken: idtoken,
            audience: process.env.CLIENT_ID
        });

        const payload = ticket.getPayload();

        response = {
            nombre: payload.name,
            email: payload.email,
            img: payload.picture,
            google: true
        };

    } catch (err) {
        console.log(err);
        return res.status(403).json({
            ok: false,
            error: err
        });
    }


    Usuario.findOne({email: response.email}, (err, usuarioDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(usuarioDB) {
            if(!usuarioDB.google) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'Debe usar usuario normal'
                    }
                });
            } else {
                const token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else {
            // si el usuario no existe en la BD
            const usuario = new Usuario();
            usuario.nombre = response.nombre;
            usuario.email = response.email;
            usuario.img = response.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((_err, _usuarioDB) => {
                if(_err) {
                    return res.status(500).json({
                        ok: false,
                        err: _err
                    });
                }

                const token = jwt.sign({
                    usuario: _usuarioDB
                }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

                return res.json({
                    ok: true,
                    usuario: _usuarioDB,
                    token
                });

            });
        }

    });

});

module.exports = app;