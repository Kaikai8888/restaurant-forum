const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', { categories }))
      .catch(error => console.log(error))
  },
  postCategory: (req, res) => {
    const name = req.body.name || ''
    if (name.trim()) {
      return Category.create({ name: name.trim() })
        .then(() => res.redirect('/admin/categories'))
    }
    return res.redirect('/admin/categories')
  }
}

module.exports = categoryController