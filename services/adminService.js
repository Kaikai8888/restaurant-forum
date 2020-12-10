const { Restaurant, User, Category, Comment } = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  postRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Name field is required.' })
    }
    const { file } = req
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) return callback({ status: 'error', message: 'Error occurs when uploading image to imgur.' })
        return Restaurant.create({
          name, tel, address, opening_hours, description, CategoryId,
          image: file ? img.data.link : null
        })
          .then(() => {
            return callback({ status: 'success', message: 'Successfully create new restaurant.' })
          })
          .catch(error => callback({ status: 'error', message: 'Error occurs when creating new restaurant in database.', error }))
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description, CategoryId,
        image: null
      })
        .then(() => {
          return callback({ status: 'success', message: 'Successfully create new restaurant.' })
        })
        .catch(error => callback({ status: 'error', message: 'Error occurs when creating new restaurant in database.', error }))
    }

  },
  putRestaurant: (req, res, callback) => {
    if (!req.body.name) {
      return callback({ status: 'error', message: 'Name field is required.' })
    }
    const { file } = req
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) return callback({ status: 'error', message: 'Error occurs when uploading image to imgur.' })
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            if (!restaurant) return callback({ status: 'error', message: 'Restaurant id not exist.' })
            restaurant.update({
              name, tel, address, opening_hours, description, CategoryId,
              image: file ? img.data.link : null
            })
              .then(() => callback({ status: 'success', message: 'Successfully edit restaurant.' }))
          })
          .catch(error => callback({ status: 'error', message: 'Error occurs when updating data in database.', error }))
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          if (!restaurant) return callback({ status: 'error', message: 'Restaurant id doesn\'t exist.' })
          return restaurant.update({
            name, tel, address, opening_hours, description, CategoryId,
            image: restaurant.image
          })
            .then((() => callback({ status: 'success', message: 'Successfully edit restaurant.' })))
        })
        .catch(error => callback({ status: 'error', message: 'Error occurs when updating data in database.', error }))
    }
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