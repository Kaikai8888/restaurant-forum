const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService.js')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => res.render('admin/categories', data))
  },
  postCategory: (req, res, next) => {
    categoryService.postCategory(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success', data.message)
        return res.redirect('/admin/categories')
      }
      req.flash('error_messages', data.message)
      return res.redirect('back')
    })
  },
  editCategory: (req, res) => {
    if (req.params.id) {
      return Category.findAll({ raw: true })
        .then(categories => {
          res.render('admin/categories', {
            categories,
            category: categories.find(category => category.id === parseInt(req.params.id, 10))
          })
        })
        .catch(error => console.log(error))
    } else {
      return res.redirect('/admin/categories')
    }
  },
  putCategory: (req, res) => {
    const name = req.body.name || ''
    if (!name.trim()) {
      req.flash('error_messages', 'name didn\'t exit')
      return res.redirect('back')
    }
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