const db = require('../models')
const Category = db.Category

const categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true })
      .then(categories => callback({ categories }))
      .catch(error => console.log(error))
  },
  postCategory: (req, res, callback) => {
    const name = req.body.name || ''
    if (!name.trim()) {
      return callback({ status: 'error', message: 'Name field is required' })
    }
    return Category.create({ name: name.trim() })
      .then((category) => callback({ status: 'success', message: 'Successfully create new category.' }))
      .catch(error => callback({ status: 'error', message: 'Error Occurs when manipulating database.' }))
  },
}

module.exports = categoryService