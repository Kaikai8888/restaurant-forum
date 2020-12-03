const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db

passport.use(new LocalStrategy({
  usernameField: 'email',
  password: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ where: { email } }).then(user => {
    if (!user) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    if (!bcrypt.compareSync(password, user.password)) return done(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return done(null, user)
  })
    .catch(error => console.log(error))
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id, {
    include: { model: Restaurant, as: 'FavoriteRestaurants' }
  })
    .then(user => {
      return done(null, user.toJSON())
    })
    .catch(error => console.log(error))
})

module.exports = passport
