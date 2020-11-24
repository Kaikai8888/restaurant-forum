const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

let userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(() => res.redirect('/signin'))
  }
}

module.exports = userController