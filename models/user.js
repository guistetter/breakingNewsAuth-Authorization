const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  username:{
    type: String, 
    require:true
  },
  password:{
    type: String,
    required: true
  }, 
  roles:{
    type: [String],
    enum:["restrito", "admin"]
  }
})

UserSchema.pre('save',function(next){
 const user = this

 if(!user.isModified('password')){
   return next()
 }

  bcrypt.genSalt((err,salt) => {
    //console.log(salt)
    bcrypt.hash(user.password, salt, (err, hash) =>{
      //console.log(hash)
      user.password = hash
      next()
    })
  })
})
//checar senha do usuario
UserSchema.methods.checkPassword = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password,(err, isMatch) => {
      if(err){
        reject(err)
      } else {
        resolve(isMatch)
      }
    })
  })
}

const User = mongoose.model('User', UserSchema)
module.exports = User