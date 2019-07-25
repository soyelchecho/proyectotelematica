const express = require('express');
/*   Declaracion Variables Node */
var bodyParser = require('body-parser');
var configuracion = require('./config/configuraciones');
var fs = require('fs');
const path = require('path');
var bcrypt = require('bcrypt');


//var session = require('express-session');
//var MemoryStore = require('memorystore')(session);

/*   FIN Declaracion Variables Node */

var app = express(); //Definicion aplicacion como express

/*  Directorios y herramientas que usa la aplicacion  */
app.use(express.static(path.join(__dirname, 'public'))); //Permitimos leer el directorio public
app.use('ejs', express.static(__dirname + '/views')); // Permitimos cargar las paginas de vista
app.use(bodyParser.urlencoded({extended:false})); // Permitimos el transpaso del body cuando hacemos un POST
app.use('/css',express.static('css'));
app.use('/img',express.static('img'));
app.use(require('./rutas/index.js'))
//app.use(bodyParser.json());
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', [__dirname + '/views']);
app.set('json spaces',2);

/*  FINDirectorios y herramientas que usa la aplicacion  */



app.listen(configuracion.puerto, function () {
  console.log('Server escuchando en puerto:  ' + configuracion.puerto);
});
