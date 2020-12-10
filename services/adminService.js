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
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (restaurant) {
          console.log('@@ delete')
          return restaurant.destroy()
            .then(() => ({ status: 'success', message: '' }))
        }
        console.log('@@ fail-1')
        return { status: 'fail', message: 'Restaurant id not exist.' }
      })
      .then(result => callback(result))
      .catch(error => {
        console.log('@@ fail-2')
        callback({ status: 'fail', message: 'Error occurs.', error })
      })
  }
}

module.exports = adminService