const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true]
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario'
    },
    estado: {
        type: Boolean
    }
});

module.exports = mongoose.model('Categoria', categoriaSchema);