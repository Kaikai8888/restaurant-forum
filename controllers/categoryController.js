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
    categoryService.putCategory(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success', data.message)
        return res.redirect('/admin/categories')
      }
      req.flash('error_messages', data.message)
      return res.redirect('back')
    })
  },
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if (data.status === 'success') {
        req.flash('success', data.message)
        return res.redirect('/admin/categories')
      }
      req.flash('error_messages', data.message)
      return res.redirect('back')
    })
  }
}

module.exports = categoryController