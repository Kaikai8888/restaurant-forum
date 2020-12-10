const { Restaurant, User, Category, Comment } = require('../models')

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category], raw: true, nest: true })
      .then(restaurants => callback({ restaurants }))
  },
}

module.exports = adminService