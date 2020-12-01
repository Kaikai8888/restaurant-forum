const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = req.query.categoryId || ''
    categoryId = parseInt(categoryId, 10) || ''
    if (categoryId) {
      whereQuery.CategoryId = categoryId
    }
    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: whereQuery
      })
    ])
      .then(results => {
        const [categories, restaurants] = results
        restaurants.forEach(r => r.description = r.description.substring(0, 50))
        return res.render('restaurants', { restaurants, categories, categoryId })
      })
      .catch(error => console.log(error))
  },
  getRestaurant: (req, res) => {
    if (!req.params.id) return res.redirect('back')
    return Restaurant.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
      .then(restaurant => {
        if (!restaurant) return res.redirect('back')
        return res.render('restaurant', { restaurant })
      })
      .catch(error => console.log(error))
  }
}

module.exports = restController