const routes = require('./routes.js')
const apis = require('./apis.js')

module.exports = (app) => {
  app.use('/', routes)
  app.use('/api', apis)
  app.use((error, req, res, next) => {
    console.log(error)
    req.flash('error_messages', 'Error occurs, please check your request or try again later.')
    return res.redirect('back')
  })
}
