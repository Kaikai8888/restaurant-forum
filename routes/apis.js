const express = require('express')
const router = express.Router()
const apiAdminController = require('../controllers/api/adminController.js')

router.get('/admin/restaurants', apiAdminController.getRestaurants)

module.exports = router