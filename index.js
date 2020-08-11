const express = require('express')
const session = require('express-session')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const mongo = process.env.MONGODB || 'mongodb://localhost/autenticacao-autorizacao'

const User = require('./models/user')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const bodyParser = require("body-parser")

mongoose.Promise = global.Promise

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({secret: 'meu-segredo'}))
//interceptar usuario logado ou nao no middleware
app.use('/restrito',(req,res, next) => {
  console.log('opa')
  if('user' in req.session){
    return next()
  }
  res.redirect('/login') 
})

app.post('/login', async (req,res) => {
  const user = await User.findOne({username: req.body.username})
  res.send(user)
})

app.use('/restrito', restrito)
app.use('/noticias', noticias)

app.get('/', (req, res) => res.render('index'))

app.get('/login', (req,res) =>{
  res.render('login')
})

const createInitialUser = async() => {
  const total = await User.count({username: 'gui'})
  if( total === 0){
    const user = new User({
      username: 'gui',
      password: 'abc123'
      })
    await user.save()
    console.log('Usuario root criado')
  }else {
    console.log('Usuario root já existe, criação n é necessario')
  }
}

mongoose.connect(mongo, {useMongoClient: true})
  .then(()=>{
    createInitialUser()
    app.listen(port, () => console.log('listening...'))
  })
  .catch(e => console.log(e))

