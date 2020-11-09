const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const {verificaTokenUrl} = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

const app = express();
app.disable("x-powered-by");

app.get('/imagen/:tipo/:img', verificaTokenUrl, async (req, res) => {

    const {tipo, img} = req.params;

    const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    try {
        if(await fs.stat(pathImg)) {
            return res.sendFile(pathImg);
        }
    } catch(err) {
        return res.sendFile(path.resolve(__dirname, '../assets/no-image.jpg'));
    }

});


module.exports = app;