const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs')
const {Schema} = mongoose;

const usuario = new Schema({
  email: String,
  usuario: String,
  password: String
});

usuario.methods.encryptContra = (password) =>{
  return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
};
usuario.methods.desencryptContra = function(password){
  return bcrypt.compareSync(password,this.password);
};

module.exports = mongoose.model('usuarios',usuario);
