const bcrypt = require('bcryptjs')
const { User, Comment, Restaurant, Favorite, Like, Followship, sequelize } = require('../models')
const QueryTypes = sequelize.QueryTypes
const { manageError, testConsoleLog } = require('../_helpers.js')
const helpers = require('../_helpers.js')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const uploadImg = (path) => {
  return new Promise((resolve, reject) => {
    imgur.setClientID(IMGUR_CLIENT_ID)
    imgur.upload(path, (error, image) => {
      if (error) return reject(error)
      return resolve(image.data.link)
    })
  })
}

let userController = {
  signUpPage: (req, res) => res.render('signup'),
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            }).then(() => {
              req.flash('success_messages', '成功註冊帳號！')
              return next()
            })
          }
        })
        .catch(error => console.log(error))
    }
  },
  signInPage: (req, res) => res.render('signin'),
  signIn: (req, res) => {
    req.flash('success_message', '成功登入')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.logout()
    req.flash('success_message', '成功登出!')
    res.redirect('/signin')
  },
  getUser: async (req, res) => {
    try {
      const UserId = Number(req.params.id)
      if (!UserId) return res.redirect('back')
      let userProfile = await User.findByPk(UserId, { include: { model: Comment, include: Restaurant } })
      if (!userProfile) return res.redirect('back')
      userProfile = userProfile.toJSON()
      const uniqueRestaurantIds = Array.from(new Set(userProfile.Comments.map(comment => comment.RestaurantId)))
      const restaurants = uniqueRestaurantIds.map(rid => userProfile.Comments.find(comment => comment.RestaurantId === rid).Restaurant)
      return res.render('user', { userProfile, restaurants, commentsCount: userProfile.Comments.length, restaurantCount: restaurants.length })
    } catch (error) {
      manageError(error, req, res)
    }
  },
  editUser: async (req, res) => {
    try {
      const id = req.params.id
      if (!Number(id) || helpers.getUser(req).id !== Number(id)) return res.redirect('back')
      const userProfile = await User.findByPk(id, { raw: true })
      if (!userProfile) return res.redirect('back')
      return res.render('editUser', { userProfile })
    } catch (error) {
      manageError(error, req, res)
    }
  },
  putUser: async (req, res) => {
    try {
      const { name } = req.body
      const id = req.params.id
      //check name input
      if (!name.trim()) {
        req.flash('error_messages', 'Name field is required.')
        return res.redirect('back')
      }
      //check id
      if (!Number(id) || helpers.getUser(req).id !== Number(id)) return res.redirect('back')
      const userProfile = await User.findByPk(id)
      if (!userProfile) return res.redirect('back')
      //update user profile
      const { file } = req
      if (file) {
        const image = await uploadImg(file.path)
        await userProfile.update({ name, image })
      } else {
        await userProfile.update({ name })
      }
      return res.redirect(`/users/${id}`)
    } catch (error) {
      manageError(error, req, res)
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({ RestaurantId: req.params.restaurantId, UserId: helpers.getUser(req).id })
      .then(() => res.redirect('back'))
      .catch(error => console.log(error))
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        RestaurantId: req.params.restaurantId,
        UserId: helpers.getUser(req).id
      }
    })
      .then(favorite => favorite.destroy())
      .then(() => res.redirect('back'))
      .catch(error => console.log(error))
  },
  like: async (req, res) => {
    try {
      const RestaurantId = Number(req.params.restaurantId)
      if (!RestaurantId) return res.redirect('back')
      const UserId = helpers.getUser(req).id
      await Like.findOrCreate({ where: { RestaurantId, UserId } })
      return res.redirect('back')
    } catch (error) {
      manageError(error, req, res)
    }
  },
  unLike: async (req, res) => {
    try {
      const RestaurantId = Number(req.params.restaurantId)
      if (!RestaurantId) return res.redirect('back')
      const UserId = helpers.getUser(req).id
      const like = await Like.findOne({ where: { RestaurantId, UserId } })
      await like.destroy()
      return res.redirect('back')
    } catch (error) {
      manageError(error, req, res)
    }
  },
  getTopUser: (req, res) => {
    User.findAll({
      include: { model: User, as: 'Followers' }
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.some(f => f.id === user.id)
      }))
      users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    }).catch(error => console.log(error))
  },
  addFollowing: (req, res) => {
    const followingId = Number(req.params.userId)
    if (!followingId) return res.redirect('back')
    Followship.findOrCreate({ where: { followingId, followerId: req.user.id } })
      .then(() => res.redirect('back'))
      .catch(error => console.log(error))
  },
  removeFollowing: (req, res) => {
    const followingId = Number(req.params.userId)
    if (!followingId) return res.redirect('back')
    Followship.findOne({ where: { followingId, followerId: req.user.id } })
      .then(followship => {
        if (!followship) return
        followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(error => console.log(error))
  }
}

module.exports = userController

