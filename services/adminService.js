const { Restaurant, User, Category, Comment } = require('../models')

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category], raw: true, nest: true })
      .then(restaurants => callback({ restaurants }))
  },
  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) return res.redirect('back')
        return callback({ restaurant: restaurant.toJSON() })
      })
  }
}

module.exports = adminService