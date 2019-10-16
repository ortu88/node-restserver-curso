require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function (req, res) {
    res.json('Get usuario');
});

app.post('/usuario', function (req, res) {
    let { body: persona } = req;

    if(persona.nombre === undefined) {

        res.status(400)
        .json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({persona});
    }

});

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    res.json({id});
});

app.delete('/usuario', function (req, res) {
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => console.log('Escuchando puerto: ', 3000));