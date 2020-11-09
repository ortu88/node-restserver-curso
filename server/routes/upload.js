const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();
app.disable('x-powered-by');

// File Upload
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', async (req, res) => {
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `Tipo no válido (${tipo}). Los tipos permitidos son ${tiposValidos.join(', ')}`
                }
            });
    }

    const archivo = req.files.archivo;

    const extensiones = ['png', 'jpg', 'gif', 'jpeg'];
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length -1];

    if (extensiones.indexOf(extension) < 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: `Extension no válida (${extension}). Las extensiones permitidas son ${extensiones.join(', ')}`
                }
            });
    }

    const nombreArchivo = `${ id }-${ Date.now() }.${ extension }`;

    try {
        await archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`);
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
    
    if(tipo === 'usuarios') {
        return await imagenUsuario(id, res, nombreArchivo);
    } else {
        return await imagenProducto(id, res, nombreArchivo);
    }

});

async function imagenUsuario(id, res, nombreArchivo) {
    let usuario;
    try {
        usuario = await Usuario.findById(id);
    } catch (err) {
        await borraArchivo(nombreArchivo, 'usuarios');
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if(!usuario) {
        await borraArchivo(nombreArchivo, 'usuarios');
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
    }

    const oldImg = usuario.img;

    await borraArchivo(oldImg, 'usuarios');

    usuario.img = nombreArchivo;

    try {
        await usuario.save();
    } catch (err) {
        await borraArchivo(nombreArchivo, 'usuarios');
        return res.status(500).json({
            ok: false,
            err
        });
    }

    return res.json({
        ok: true,
        usuario,
        img: nombreArchivo
    });

}

async function imagenProducto(id, res, nombreArchivo) {
    let producto;
    try {
        producto = await Producto.findById(id);
    } catch (err) {
        await borraArchivo(nombreArchivo, 'productos');
        return res.status(500).json({
            ok: false,
            err
        });
    }

    if(!producto) {
        await borraArchivo(nombreArchivo, 'productos');
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
    }

    const oldImg = producto.img;

    await borraArchivo(oldImg, 'productos');

    producto.img = nombreArchivo;

    try {
        await producto.save();
    } catch (err) {
        await borraArchivo(nombreArchivo, 'productos');
        return res.status(500).json({
            ok: false,
            err
        });
    }

    return res.json({
        ok: true,
        producto,
        img: nombreArchivo
    });
}

async function borraArchivo(oldImg, tipo) {
    if (oldImg) {
        const pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${oldImg}`);

        try {
            if (await fs.promises.stat(pathImg)) {
            
                if (await fs.promises.unlink(pathImg)) console.log('Se borró imagen antigua correctamente');
    
            }
        } catch(err) {
            console.log(err);
        }
        
    }
}

module.exports = app;