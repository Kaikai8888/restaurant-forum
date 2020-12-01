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
    req.flash('error_messages', 'name didn\'t exist')
    return res.redirect('/admin/categories')
  },
  editCategory: (req, res) => {
    return Category.findAll({ raw: true })
      .then(categories => res.render('admin/categories', {
        categories,
        category: categories.find(category => category.id === parseInt(req.params.id, 10))
      }))
      .catch(error => console.log(error))
  },
  putCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) return
        return category.update({ name: req.body.name })
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => console.log(error))
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => {
        if (!category) return
        return category.destroy()
      })
      .then(() => res.redirect('/admin/categories'))
      .catch(error => console.log(error))
  }
}

module.exports = categoryController