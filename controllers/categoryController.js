const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(error => console.log(error))
  }
}

module.exports = categoryController