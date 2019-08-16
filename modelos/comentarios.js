const Mongoose = require('mongoose');

const comentario = Mongoose.Schema({
    _idComentario: Mongoose.Schema.Types.ObjectId,
    _idTema : {type: String},
    nombreUsuario: {type: String},
    fechaCreacion: { type: Date, default: Date.now },
    comentario : {type: String},
});

module.exports = Mongoose.model('Comentario',comentario);
