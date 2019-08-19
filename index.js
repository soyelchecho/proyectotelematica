const express = require('express');
/*   Declaracion Variables Node */
var bodyParser = require('body-parser');
var configuracion = require('./config/configuraciones');
var fs = require('fs');
const path = require('path');
var bcrypt = require('bcrypt');
var glob = require('glob');
var multer = require('multer');
const Mongoose = require("mongoose");
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

/*   FIN Declaracion Variables Node */
console.log(configuracion);

var models = glob.sync(configuracion.ruta + '/modelos/*.js');
models.forEach(function (model) {
  require(model);
});

var app = express(); //Definicion aplicacion como express

require('./passport/local');
/*  Directorios y herramientas que usa la aplicacion  */

app.use(morgan('dev'));

app.use(session({
  secret: '*secreto*',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    app.locals.MensajeRegistroEmail = req.flash('MensajeRegistroEmail');
    app.locals.MensajeRegistroUsuario = req.flash('MensajeRegistroUsuario');
    app.locals.usuario = req.user;
    next();
});

app.use('ejs', express.static(__dirname + '/views')); // Permitimos cargar las paginas de vista
app.use(bodyParser.urlencoded({extended:true})); // Permitimos el transpaso del body cuando hacemos un POST con cosas pesadas
app.use('/css',express.static('css'));
app.use('/img',express.static('img'));
app.use(require('./rutas/index.js'));
app.use(multer({dest:__dirname+'/file/uploads/'}).any()); // for parsing multipart/form-data
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', [__dirname + '/views']);
app.use(bodyParser.json()); // for parsing application/json
/*  FINDirectorios y herramientas que usa la aplicacion  */

Mongoose.connect(configuracion.mongodb.Comentarios,{useNewUrlParser:true});
Mongoose.Promise = global.Promise;

const Tema = require('./modelos/temas');
const Comentario = require('./modelos/comentarios');
const Usuario = require('./modelos/usuarios');

function isAuthenticated(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}


app.post('/creartema', isAuthenticated,(req, res) => {
  const tema = new Tema({
    _id: new Mongoose.Types.ObjectId(),
    titulo: req.body.tituloTema,
    usuario: req.body.usuario
  });
  tema.save()
  .then(result =>  {
   res.send(JSON.stringify(result));})
   .catch(err => {
     console.log(err);
     res.status(500).json({
       error: err
     });
    });
});
app.post('/filtrarUsuario',isAuthenticated,function(req,res,next){
  var usuario = req.body.datos;
  Comentario.find({"nombreUsuario": usuario})
    .exec()
    .then(doc =>  {
      if(doc){
        res.status(201).json(doc);
      }else{
        res.status(404).json({
          message: 'Error con el usuario, no tiene comentarios'
        })
      }
    }).catch(err => {
      res.status(500).json({error:err});
    });
});
app.post('/filtrarCorreo',isAuthenticated,function(req,res,next){
  var usuario = req.body.datos;
  Usuario.findOne({email:usuario}).then(docs=>{
    Comentario.find({"nombreUsuario":docs.usuario}).exec()
    .then(doc =>{
      if(doc){
        res.status(201).json(doc);
      }else{
        res.status(404).json({
          message: 'Error con el usuario, no tiene comentarios'
        })
      }
    }).catch(err => {
      res.status(500).json({error:err});
    });
  }).catch(err => {
    res.status(500).json({error:err});
  });
});
app.post('/filtrarTema',isAuthenticated,function(req,res,next){
  var tema = req.body.datos;
  Tema.find({titulo:tema}).then(docs=>{
    if(docs){
      var comentariosEncontrados = [];
      var contador = 0;
      for(var s = 0; s < Object.keys(docs).length;s++){
        Comentario.find({"_idTema":docs[s]._id}).exec()
        .then(doc =>{
          if(doc){
            for (var i = 0; i < Object.keys(doc).length; i++) {
              comentariosEncontrados.push(doc[i]);
            }
            contador++;
            if(contador == Object.keys(docs).length){
              res.status(201).json(comentariosEncontrados);
            }
          }else{
            res.status(404).json({
              message: 'Error con el usuario, no tiene comentarios'
            })
          }
        }).catch(err => {
          res.status(500).json({error:err});
        });
      }
    }

  }).catch(err => {
    res.status(500).json({error:err});
  });
});

app.post('/crearComentario',isAuthenticated, (req, res) => {
  const comentario = new Comentario({
    _idComentario: new Mongoose.Types.ObjectId(),
    _idTema : req.body.temaid,
    nombreUsuario: req.body.nombreUsuario,
    comentario :  req.body.comentario
  });
  comentario.save()
  .then(result =>  {
   res.send(comentario);})
   .catch(err => {
     console.log(err);
     res.status(500).json({
       error: err
     });
    });
});

app.patch("/cambiar/:comentarioId", isAuthenticated,(req,res,next) =>{
  const id = req.params.comentarioId;
  Comentario.update({_idComentario:id},{$set:{comentario:req.body.datos}})
  .exec()
  .then(result=>{
    res.status(200).json(result);
  })
  .catch(err=>{
    res.status(500).json({
      error:err
    });
  });
});


app.listen(configuracion.puerto, function () {
  console.log('Server escuchando en puerto:  ' + configuracion.puerto);
});
