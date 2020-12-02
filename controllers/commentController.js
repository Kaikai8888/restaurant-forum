const { Comment } = require('../models')

module.exports = {
  postComment: (req, res) => {
    const RestaurantId = Number(req.query.restaurantId)
    const UserId = req.user.id
    const text = req.body.text
    if (!RestaurantId) return res.redirect('back')
    if (!text.trim()) {
      req.flash('error_messages', 'comment shouldn\'t be empty')
      return res.redirect('back')
    }

    return Comment.create({ text, RestaurantId, UserId })
      .then(() => {
        req.flash('success_messages', 'successfully create new comment')
        return res.redirect('back')
      })
      .catch(error => console.log(error))
  },
  deleteComment: (req, res) => {

  }
}