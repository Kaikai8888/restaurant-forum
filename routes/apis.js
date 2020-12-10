const express = require('express')
const router = express.Router()
const apiAdminController = require('../controllers/api/adminController.js')
const apiCategoryController = require('../controllers/api/categoryController.js')

router.get('/admin/restaurants', apiAdminController.getRestaurants)
router.get('/admin/restaurants/:id', apiAdminController.getRestaurant)
router.get('/admin/categories', apiCategoryController.getCategories)

module.exports = router