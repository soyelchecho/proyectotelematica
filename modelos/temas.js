const Mongoose = require('mongoose');

const temaEsquema = Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    titulo: { type: String, required:true,default:"Una cosa" },
    usuario:{type: String},
    fechaCreacion: { type: Date, default: Date.now },
  //  imagen: { data: Buffer, contentType: String }
});

module.exports = Mongoose.model('Tema',temaEsquema);
