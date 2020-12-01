const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category], raw: true, nest: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category], raw: true, nest: true })
      .then(restaurant => res.render('admin/restaurant', { restaurant }))
  },
  createRestaurant: (req, res) => {
    return Category.findAll({ raw: true }).then(categories => res.render('admin/create', { categories }))
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) return console.log('Error:', err)
        return Restaurant.create({
          name, tel, address, opening_hours, description, CategoryId,
          image: file ? img.data.link : null
        })
          .then(() => {
            req.flash('success_messages', '已成功新增餐廳')
            res.redirect('/admin/restaurants')
          })
          .catch(error => console.log(error))
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description, CategoryId,
        image: null
      })
        .then(() => {
          req.flash('success_messages', '已成功新增餐廳')
          res.redirect('/admin/restaurants')
        })
        .catch(error => console.log(error))
    }


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
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    const { file } = req
    const { name, tel, address, opening_hours, description, CategoryId } = req.body
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) return console.log('Error:', err)
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => restaurant.update({
            name, tel, address, opening_hours, description, CategoryId,
            image: file ? img.data.link : null
          }))
          .then(() => {
            req.flash('success_messages', '已成功編輯餐廳資訊')
            res.redirect('/admin/restaurants')
          })
          .catch(error => console.log(error))
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => restaurant.update({
          name, tel, address, opening_hours, description, CategoryId,
          image: restaurant.image
        }))
        .then((restaurant => {
          req.flash('success_messages', '已成功更新餐廳資訊')
          res.redirect('/admin/restaurants')
        }))
        .catch(error => console.log(error))
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.destroy())
      .then((restaurant) => res.redirect('/admin/restaurants'))
      .catch(error => console.log(error))
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

module.exports = restController