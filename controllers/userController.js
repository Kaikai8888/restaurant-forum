const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { manageError } = require('../_helpers.js')
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
      const userProfile = await User.findByPk(req.params.id)
      if (!userProfile) return res.redirect('back')
      return res.render('user', { userProfile: userProfile.toJSON() })
    } catch (error) {
      manageError(error, req, res)
    }
  },
  editUser: async (req, res) => {
    try {
      if (req.user.id !== Number(req.params.id)) return res.redirect('back')
      const userProfile = await User.findByPk(req.params.id, { raw: true })
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
      if (!Number(id) || req.user.id !== Number(id)) return res.redirect('back')
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
      return res.redirect(`/users/${id}}`)
    } catch (error) {
      manageError(error, req, res)
    }
  }
}

module.exports = userController

