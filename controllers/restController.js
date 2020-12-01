const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        restaurants.forEach(r => r.description = r.description.substring(0, 50))
        return res.render('restaurants', { restaurants })
      })
      .catch(error => console.log(error))
  }
}

module.exports = restController