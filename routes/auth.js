const express = require('express')
const router = express.Router()
const User = require('../models/user')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

router.use(passport.initialize())
router.use(passport.session())

//serialize do passport
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})

//definindo a estrategia para login local
passport.use(new LocalStrategy(async(username, password, done)=>{
  const user = await User.findOne({username})
  if(user){
    const isValid = await user.checkPassword(password)
    if(isValid){
      return done(null, user)
    } else{
      return done(null, false)
    }
  } else {
    return done(null, false)
  }
}))

//middleware para mosrar usuario logado
router.use((req,res, next) => {
  if('user' in req.session){
    res.locals.user = req.session.user
    res.locals.role = req.session.role
  }
  next()
})

router.get('/change-role/:role',(req,res) =>{
  if('user' in req.session){
    if(req.session.user.roles.indexOf(req.params.role) >=0){
      req.session.role = req.params.role
    }
  } 
  res.redirect('/')
})

router.get('/login', (req,res) =>{
  res.render('login')
})

router.get('/logout', (req,res) =>{
  req.session.destroy(() => {
    res.redirect('/')
  });
  
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: false
}))

module.exports = router