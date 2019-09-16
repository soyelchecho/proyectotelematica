const {Router} = require('express');
const router = Router();
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const client = require('../config/redis-client');


const Tema = require('../modelos/temas')
const Comentario = require('../modelos/comentarios')

function isAuthenticated(req,res,next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

router.post('/login',passport.authenticate('local-iniciar',{
  successRedirect:'/pagina',
  failureRedirect:'/',
  passReqToCallback:true
}));

router.post('/registro',passport.authenticate('local-registro',{
  successRedirect:'/pagina',
  failureRedirect:'/',
  passReqToCallback:true
}));

router.get('/',function(req,res,next){
  res.render('login.ejs')
});

router.get('/pagina',isAuthenticated,function(req,res,next){
  res.render('pagina.ejs')
});

router.get('/salir',isAuthenticated,(req,res,next)=>{
  req.logout();
  res.redirect('/');
});



router.get('/temas',isAuthenticated,(req,res,next)=>  {
  client.cliente.get('temas', function (err, reply) {
    if (err){
      res.status(404).json({message: 'No se encontro la data'});
    }else if(reply){
      res.status(200).send(JSON.parse(reply));
    }else{
      Tema.find().exec().then(docs=>{
        if(docs.length >= 0){
            client.cliente.set('temas', JSON.stringify(docs));
            client.cliente.expire('temas',10);
          res.status(200).send(docs);
        }else{
          res.status(404).json({
            message: 'No se encontro la data'
          });
        }
      }).catch(err=>{
        res.status(500).json({
          error:err
        });
      });
    }
  });
});

router.get('/comentarios',isAuthenticated,(req,res,next)=>  {
    client.cliente.get('comentarios', function (err, reply) {
    if (err){
      res.status(404).json({message: 'No se encontro la data'});
    }else if(reply){
      res.status(200).send(JSON.parse(reply));
    }else{
      Comentario.find().exec().then(docs=>{
        if(docs.length >= 0){
            client.cliente.set('comentarios', JSON.stringify(docs));
            client.cliente.expire('comentarios',2);
          res.status(200).send(docs);
        }else{
          res.status(404).json({
            message: 'No se encontro la data'
          });
        }
      }).catch(err=>{
        console.log(err);
        res.status(500).json({
          error:err
        });
      });
    }
  });
});


router.get('/:temaId',isAuthenticated, (req, res) => {
  const id = req.params.temaId;
  llave = 'tema' + id
    client.cliente.get(llave, function (err, reply) {
    if (err){
      res.status(404).json({message: 'No se encontro la data'});
    }else if(reply){
      res.status(200).send(JSON.parse(reply));
    }else{
    Tema.findById(id)
      .exec()
      .then(doc =>  {
        if(doc){
            client.cliente.set(llave, JSON.stringify(docs));
          res.status(200).send(docs);
        }else{
          res.status(404).json({
            message: 'No se puede encontrar el tema'
          })
        }
      }).catch(err => {
        res.status(500).json({error:err});
      });
    }
  });
});


router.patch("/:temaId",isAuthenticated, (req,res,next) =>{
  const id = req.params.temaId;
  Tema.update({_id:id},{$set:{titulo:req.body.nuevoTitulo}})
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


router.delete("/:temaId",isAuthenticated,(req,res,next)=>{
  const id = req.params.temaId;
  Comentario.remove({_idTema:id}).exec()
  .then().catch();
  Tema.remove({_id:id}).exec()
  .then(result=>{
    res.status(200).json(result);
  })
  .catch(err =>{
    res.status(500).json({
        error:err
    });
  });
});

router.delete("/comentarios/:comentarioId",isAuthenticated,(req,res,next)=>{
  var temaid = req.params.comentarioId;
  Comentario.remove({_idComentario:temaid}).exec()
  .then(result=>{
    res.status(200).json(result);
  })
  .catch(err =>{
    res.status(500).json({
        error:err
    });
  });
});

//LISTOOOOOOOOOOOOOO RES
router.get('/comentarios/:temaId',isAuthenticated,function(req,res,next){
  var temaid = req.params.temaId;
    client.cliente.get(temaid, function (err, reply) {
    if (err){
      res.status(404).json({message: 'No se encontro la data'});
    }else if(reply){
      res.status(200).send(JSON.parse(reply));
    }else{
      Comentario.find({"_idTema": temaid})
        .exec()
        .then(docs =>  {
          if(docs){
              client.cliente.set(temaid, JSON.stringify(docs));
              client.cliente.expire(temaid,10);
            res.status(200).send(docs);
          }else{
            res.status(404).json({
              message: 'No se puede encontrar el tema'
            })
          }
        }).catch(err => {
          res.status(500).json({error:err});
        });
    }
  });
});



module.exports = router;
