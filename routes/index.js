const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('error_messages', '請先登入')
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) return next()
      return res.redirect('/')
    }
    req.flash('error_messages', '請先登入')
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/admin', authenticated, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp, passport.authenticate('local', {
    failureRedirect: '/signin',
    failureMessage: true
  }),
    userController.signIn)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureMessage: true
  }),
    userController.signIn)
  app.get('/logout', userController.logout)

}
