const express = require('express')
const router = express.Router()
const apiAdminController = require('../controllers/api/adminController.js')
const apiCategoryController = require('../controllers/api/categoryController.js')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

router.get('/admin/restaurants', apiAdminController.getRestaurants)
router.get('/admin/restaurants/:id', apiAdminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), apiAdminController.postRestaurant)
router.put('/admin/restaurants/:id', upload.single('image'), apiAdminController.putRestaurant)
router.delete('/admin/restaurants/:id', apiAdminController.deleteRestaurant)

router.get('/admin/categories', apiCategoryController.getCategories)
router.post('/admin/categories', apiCategoryController.postCategory)
router.put('/admin/categories/:id', apiCategoryController.putCategory)


module.exports = router