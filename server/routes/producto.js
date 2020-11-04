const express = require('express');
const {verificaToken} = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

const app = express();

//================================
//Obteber productos
//================================
app.get('/productos', (req, res) => {

});

module.exports = app;