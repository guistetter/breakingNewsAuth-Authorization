const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia')

router.get('/', async (req, res) => {
  /*desta forma usuario nao logado ve apenas publica, usuario logado ve tudo
   let conditions = {}
   if(!('user' in req.session)){
     conditions = {category:"public"}
   }*/ 
  const conditions = {category: 'public'}
  const noticias = await Noticia.find(conditions)
  res.render('noticias/index',{noticias})
})

module.exports = router