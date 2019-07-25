const {Router} = require('express');
const router = Router();
const AWS = require('aws-sdk');
const path = require('path');

const BUCKET_NAME = 'forointeractivo';
const IAM_USER_KEY = 'AKIAZYUP7S7HZABF6HNT';
const IAM_USER_SECRET = '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';

var s3bucket = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  Bucket: BUCKET_NAME
});
var parametrosEntrada = {
 Bucket: BUCKET_NAME,
 Key: "comentarios.json",
};

router.get('/',function(req,res,next){
    //LEER DEL BUCKET S3 EN NODE
  s3bucket.getObject(parametrosEntrada, function(err, data) {
    if (err) console.log(err, err.stack); //Si sucede una falla
    else     console.log(data.Body.toString('utf-8'));
  });
    //TERMINAR LECTURA DEL BUCKET S3
  res.render('index');
});

router.get('/comentarios',function(req,res,next){
  res.json(data);
});

router.post('/crear_comentario',(req,res)=>{
  let parametrosSalida = {
      Bucket: BUCKET_NAME,
      Key: "comentarios.json",
      ACL: 'public-read',
      ContentType: 'application/json',
      Body: '{tema: "Hello", process: 300}',
    };
  s3.putObject(params, function (err, data) {
      if (err) {
        console.log(err);
        res.render('index', { title: 'Error' });
        return 0;
      }

      const textResponse = 'Successfully uploaded data to ' + myBucket + '/' + myKey;
      console.log(textResponse);
      res.render('index', { title: textResponse });
    });
  console.log(req.body.tema);
  res.send({message:req.body.tema});
});

module.exports = router;
