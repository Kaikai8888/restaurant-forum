function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

function manageError(error, req, res) {
  console.log(error)
  req.flash('error_messages', 'Error occurs, please try again later.')
  res.redirect('back')
}

module.exports = {
  ensureAuthenticated,
  getUser,
  manageError
};