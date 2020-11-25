const db = require('../models')
const Restaurant = db.Restaurant
const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => res.render('admin/restaurants', { restaurants }))
  },
  getRestaurant: (req, res) => {
    console.log('@@show')
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => res.render('admin/restaurant', { restaurant }))
  },
  createRestaurant: (req, res) => {
    console.log('@@create')
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    Restaurant.create({ ...req.body })
      .then(() => {
        req.flash('success_messages', '已成功新增餐廳')
        res.redirect('/admin/restaurants')
      })
      .catch(error => console.log(error))
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => res.render('admin/create', { restaurant }))
      .catch(error => console.log(error))
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.update({ ...req.body }))
      .then((restaurant => {
        req.flash('success_messages', '已成功更新餐廳資訊')
        res.redirect('/admin/restaurants')
      }))
      .catch(error => console.log(error))
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => restaurant.destroy())
      .then((restaurant) => res.redirect('/admin/restaurants'))
      .catch(error => console.log(error))
  }

}

module.exports = restController