const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')

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

    const { file, name, tel, address, opening_hours, description } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) return console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data,
          () => Restaurant.create({
            name, tel, address, opening_hours, description,
            image: file ? `/upload/${file.originalname}` : null
          })
            .then(() => {
              req.flash('success_messages', '已成功新增餐廳')
              res.redirect('/admin/restaurants')
            })
            .catch(error => console.log(error))
        )
      })
    } else {
      return Restaurant.create({
        name, tel, address, opening_hours, description,
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
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => res.render('admin/create', { restaurant }))
      .catch(error => console.log(error))
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', '請填寫餐廳名稱')
      return res.redirect('back')
    }
    const { file, name, tel, address, opening_hours, description } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) return console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data,
          () => {
            return Restaurant.findByPk(req.params.id)
              .then(restaurant => restaurant.update({
                name, tel, address, opening_hours, description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              }))
              .then(() => {
                req.flash('success_messages', '已成功新增餐廳')
                res.redirect('/admin/restaurants')
              })
              .catch(error => console.log(error))
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => restaurant.update({
          name, tel, address, opening_hours, description,
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
  }

}

module.exports = restController