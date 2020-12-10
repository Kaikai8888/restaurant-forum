const categoryService = require('../../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => res.json(data))
  },
  postCategory: (req, res) => {
    categoryService.postCategories(req, res, (data) => res.json(data))
  },
}

module.exports = categoryController