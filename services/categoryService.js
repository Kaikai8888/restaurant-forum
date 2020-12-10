const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true })
      .then(categories => callback({ categories }))
      .catch(error => console.log(error))
  },
}

module.exports = categoryService