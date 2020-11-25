const db = require('../models')
const Restaurant = db.Restaurant
const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => res.render('admin/restaurants', { restaurants }))
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('/admin/restaurants/create')
    }
    Restaurant.create({ ...req.body })
      .then(() => {
        req.flash('success_messages', '已成功新增餐廳')
        res.redirect('/admin/restaurants')
      })
      .catch(error => console.log(error))
  }
}

module.exports = restController