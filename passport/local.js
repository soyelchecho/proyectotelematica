const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const Usuario = require('../modelos/usuarios');

passport.serializeUser((user,done)=>{
  done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
  const usuario = await Usuario.findById(id);
  done(null,usuario);
});

passport.use('local-registro',new localStrategy({
  usernameField:'email',
  userField:'usuario',
  passwordField:'password',
  passReqToCallback: true
},function (req,email,password,done){
  Usuario.findOne({email:req.body.email}).then(docs=>{
    if(docs != null){
      return done(null, false, req.flash('MensajeRegistroEmail','Ya existe el email ingresado'));
    }else{
      Usuario.findOne({usuario:req.body.usuario}).then(docs=>{
        if(docs != null){
          return done(null, false, req.flash('MensajeRegistroUsuario','Ya existe el usuario ingresado'));
        }else{
          const nuevoUsuario = new Usuario();
          nuevoUsuario.email = req.body.email;
          nuevoUsuario.password = nuevoUsuario.encryptContra(req.body.password);
          nuevoUsuario.usuario = req.body.usuario;
          nuevoUsuario.save().then(result =>  {
            done(null,nuevoUsuario);
          });
        }
      });
    }
  }).catch();
}));

passport.use('local-iniciar',new localStrategy({
  usernameField:'usuario',
  passwordField:'password',
  passReqToCallback: true
},function (req,email,password,done){
  Usuario.findOne({usuario:req.body.usuario}).then(docs=>{
    if(docs == null){
      Usuario.findOne({email:req.body.usuario}).then(docs=>{
        if(docs== null){
          return done(null, false, req.flash('MensajeRegistroUsuario','No existe ninguna cuenta con este usuario/correo'));
        }else{
          if(!docs.desencryptContra(password)){
            return done(null,false,req.flash('MensajeRegistroUsuario','¡Contraseña incorrecta!'));
          }else{
            done(null,docs);
          }
        }
      });
    }else{
      if(!docs.desencryptContra(password)){
        return done(null,false,req.flash('MensajeRegistroUsuario','¡Contraseña incorrecta!'));
      }else{
        done(null,docs);
      }
    }
  }).catch();
}));
