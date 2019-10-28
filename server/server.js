require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use( require('./routes/usuario') )


mongoose.connect('mongodb://localhost:27017/cafe', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, res) => {
    if(err) {
        throw err;
    } 

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => console.log('Escuchando puerto: ', 3000));