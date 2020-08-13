const express = require('express')

const router = express.Router()

const Noticia = require('../models/noticia'
)
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