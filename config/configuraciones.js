var path = require('path');
var rutaLocal = path.normalize(__dirname + '/..'); // Me permite encontrar la ruta en la que estoy.
var ambiente = process.env.NODE_ENV || 'test'; // Defino que ambiente estoy usando, ambiente = default (e):

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
    test: {
    baseUrl: "/",
    ruta: rutaLocal,
    app: {
      name: 'ForoInteractivo'
    },
    mongodb:{
      Comentarios:'mongodb://mongo-server/ForoInteractivo'
    },
    puerto: process.env.PORT || 3000
  },
  produccion: {
    baseUrl: "/",
    ruta: rutaLocal,
    app: {
      name: 'ForoInteractivo'
    },
    mongodb:{
      Comentarios:'mongodb+srv://admin:123@cluster0-mlrw3.mongodb.net/test?retryWrites=true&w=majority'
    },
    puerto: process.env.PORT || 3000
  }
};
module.exports = configuracion[ambiente]
