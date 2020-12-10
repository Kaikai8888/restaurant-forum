const { Restaurant, User, Category, Comment } = require('../models')

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({ include: [Category], raw: true, nest: true })
      .then(restaurants => callback({ restaurants }))
      .catch(error => callback({ status: 'error', message: 'Error occurs on database side', error }))
  },
  getRestaurant: (req, res, callback) => {
    const id = Number(req.params.id)
    if (!id) return callback({ status: 'error', message: 'Invalid restaurant id.' })
    return Restaurant.findByPk(id, { include: [Category] })
      .then(restaurant => {
        if (!restaurant) return callback({ status: 'error', message: 'Cannot find the restaurant id.' })
        return callback({ restaurant: restaurant.toJSON() })
      })
      .catch(error => callback({ status: 'error', message: 'Error occurs on database side', error }))
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (restaurant) {
          return restaurant.destroy()
            .then(() => ({ status: 'success', message: '' }))
        }
        return { status: 'error', message: 'Restaurant id not exist.' }
      })
      .then(result => callback(result))
      .catch(error => {
        callback({ status: 'error', message: 'Error occurs on database side', error })
      })
  }
}

module.exports = adminService