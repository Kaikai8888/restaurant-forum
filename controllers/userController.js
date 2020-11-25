const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

let userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(() => {
              req.flash('success_messages', '成功註冊帳號！')
              return next()
            })
          }
        })
        .catch(error => console.log(error))
    }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_message', '成功登出!')
    res.redirect('/signin')
  }
}

module.exports = userController