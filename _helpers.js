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

function testConsoleLog(position, ...variables) {
  console.log('\n---------------------------')
  console.log('@@', position)
  variables.forEach((v, i) => {
    console.log(`@@${i + 1} :`)
    console.log(v)
    console.log('---------------------------')
  })
  console.log('---------------------------\n')
}

module.exports = {
  ensureAuthenticated,
  getUser,
  manageError,
  testConsoleLog
};