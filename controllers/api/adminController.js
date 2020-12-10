const adminService = require('../../services/adminService.js')

const adminController = {
  getRestaurants: (req, res) => {
    return adminService.getRestaurants(req, res, (data) => res.json(data))
  },
  getRestaurant: (req, res) => { adminService.getRestaurant(req, res, data => res.json(data)) },
}

module.exports = adminController