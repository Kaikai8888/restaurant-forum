const { Restaurant, Category, User, Comment } = require('../models')
const { manageError, testConsoleLog } = require('../_helpers.js')
const helpers = require('../_helpers.js')
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

        restaurants.rows.forEach(r => {
          r.description = r.description.substring(0, 50)
          r.isFavorite = req.user.FavoriteRestaurants.map(fr => fr.id).includes(r.id)
          r.like = req.user.LikeRestaurants.map(lr => lr.id).includes(r.id)
        })

        return res.render('restaurants', {
          restaurants: restaurants.rows,
          pages, curPage, pre, next,
          categories, categoryId
        })
      })
      .catch(error => console.log(error))
  },
  getRestaurant: async (req, res) => {
    try {
      if (!req.params.id) return res.redirect('back')
      let restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoriteUsers' },
          { model: User, as: 'LikeUsers' }
        ]
      })
      if (!restaurant) return res.redirect('back')
      await restaurant.increment('viewCounts')
      const userId = helpers.getUser(req).id
      restaurant = restaurant.toJSON()
      restaurant.isFavorite = restaurant.FavoriteUsers.map(u => u.id).includes(userId)
      restaurant.like = restaurant.LikeUsers.map(u => u.id).includes(userId)

      return res.render('restaurant', { restaurant })

    } catch (error) {
      console.log(error)
    }
  },
  getFeeds: (req, res) => {
    Promise.all([
      Restaurant.findAll({
        include: Category,
        order: [['createdAt', 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      }),
      Comment.findAll({
        include: [Restaurant, User],
        order: [['createdAt', 'DESC']],
        limit: 10,
        raw: true,
        nest: true
      })
    ])
      .then(results => res.render('feeds', {
        restaurants: results[0],
        comments: results[1]
      }))
      .catch(error => console.log(error))
  },
  getDashboard: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: User }
      ]
    }).then(restaurant => {
      if (!restaurant) return res.redirect('back')
      restaurant = restaurant.toJSON()
      return res.render('dashboard', { restaurant, comments: restaurant.Comments.length })
    })
      .catch(error => manageError(error, req, res))
  }
}

module.exports = restController


