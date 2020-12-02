const { Restaurant, Category, User, Comment } = require('../models')
const PAGE_LIMIT = 10

const restController = {
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let { categoryId, curPage } = req.query
    let offset = 0
    categoryId = Number(categoryId) || ''
    curPage = Number(curPage) || 1

    if (curPage) {
      offset = (curPage - 1) * PAGE_LIMIT
    }

    if (categoryId) {
      whereQuery.CategoryId = categoryId
    }

    return Promise.all([
      Category.findAll({ raw: true }),
      Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: [Category],
        where: whereQuery,
        limit: PAGE_LIMIT,
        offset
      })
    ])
      .then(results => {
        let [categories, restaurants] = results
        const totalPages = Math.ceil(restaurants.count / PAGE_LIMIT)
        const pages = Array.from({ length: totalPages }).map((_, i) => i + 1)
        const pre = curPage - 1 || 1
        const next = curPage + 1 > totalPages ? totalPages : curPage + 1

        restaurants.rows.forEach(r => r.description = r.description.substring(0, 50))

        return res.render('restaurants', {
          restaurants: restaurants.rows,
          pages, curPage, pre, next,
          categories, categoryId
        })
      })
      .catch(error => console.log(error))
  },
  getRestaurant: (req, res) => {
    if (!req.params.id) return res.redirect('back')
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
      .then(restaurant => {
        if (!restaurant) return res.redirect('back')
        return res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
      .catch(error => console.log(error))
  }
}

module.exports = restController


