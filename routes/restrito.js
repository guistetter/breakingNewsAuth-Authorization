const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia')

//interceptar usuario logado ou nao no middleware
router.use((req,res, next) => {
  console.log('opa')
  if('user' in req.session){
    if(req.session.roles.indexOf('restritro')>0){
      return next()
    } else {
      res.redirect('/')
    }
  }
  res.redirect('/login') 
})

router.get('/', (req, res) => {
  res.send('restrito')
})

//nao preciso validar usuario, pois o middleware já garante que se o usuario
//chegou aqui ele já ta logado, diferente das noticias publicas...
router.get('/noticias', async (req, res) => {
  const noticias = await Noticia.find({category: 'private'})
  res.render('noticias/restrito', {noticias})
})

module.exports = router