const { Restaurant, User, Category, Comment } = require('../models')
const adminService = require('../services/adminService.js')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      if (data.status === 'error') return next(data)
      res.render('admin/restaurants', data)
    })
  },
  getRestaurant: (req, res, next) => {
    adminService.getRestaurant(req, res, data => {
      if (data.status === 'error') return next(data)
      res.render('admin/restaurant', data)
    })
  },
  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true }).then(categories => res.render('admin/create', { categories }))
  },
  postRestaurant: (req, res, next) => {
    adminService.postRestaurant(req, res, data => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/restaurants')
      }
      next(data)
    })
  },
  editRestaurant: (req, res) => {
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findByPk(req.params.id, { raw: true })
    ])
      .then(results => res.render('admin/create', { categories: results[0], restaurant: results[1] }))
      .catch(error => console.log(error))

  },
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data.status === 'success') {
        req.flash('success_messages', data.message)
        return res.redirect('/admin/restaurants')
      }
      next(data)
    })
  },
  deleteRestaurant: (req, res, next) => {
    return adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
      next(data)
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => res.render('admin/users', { users }))
      .catch(error => console.log(error))
  },
  putUsers: (req, res) => {
    User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          return req.flash('error_messages', 'Cannot find user')
        }
        console.log(user.isAdmin)
        req.flash('success_messages', 'user was successfully updated')
        return user.update({ isAdmin: !user.isAdmin })
      })
      .then(() => res.redirect('/admin/users'))
      .catch(error => console.log(error))
  },


}

module.exports = adminController