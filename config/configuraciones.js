var path = require('path');
var rutaLocal = path.normalize(__dirname + '/..'); // Me permite encontrar la ruta en la que estoy.
var ambiente = 'desarrollo'; // Defino que ambiente estoy usando, ambiente = default (e):

var configuracion = {
  desarrollo: {
    ruta: rutaLocal,
    mongodb:{
      Comentarios:'mongodb://localhost/ForoInteractivo'
    },
    aplicacion: {
      nombre: 'ForoInteractivo'
    },
    puerto: process.env.PORT || 3000,
  },
  produccion: {
    ruta: rutaLocal,
    aplicacion: {
      nombre: 'ForoInteractivo'
    },
    puerto: process.env.PORT || 3000
  }
};
module.exports = configuracion[ambiente]
