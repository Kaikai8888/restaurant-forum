const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const { manageError } = require('./_helpers.js')
if (process.env.NOED_ENV !== 'production') {
  require('dotenv').config()
}
const helpers = require('./config/handlebars-helpers.js')
const passport = require('./config/passport.js')
const app = express()
const port = process.env.PORT || 3000

app.engine('hbs', handlebars({
  defaultLayout: 'main', extname: 'hbs', helpers
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({
  secret: 'fejwiovnur',
  resave: false,
  saveUninitialized: true
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)
app.use((error, req, res, next) => {
  console.log(error)
  req.flash('error_messages', 'Error occurs, please check your request or try again later.')
  return res.redirect('back')
})

module.exports = app
