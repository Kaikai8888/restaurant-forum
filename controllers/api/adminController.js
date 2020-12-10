const { Restaurant, Category } = require('../../models')

const restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ include: [Category], raw: true, nest: true })
      .then(restaurants => res.json({ restaurants }))
  },
}

module.exports = restController