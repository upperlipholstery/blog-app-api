// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')

// pull in Mongoose model for uploads
const User = require('../models/user')
const s3Delete = require('../../lib/s3Delete')
const s3Upload = require('../../lib/s3Upload')

// require multer
const multer = require('multer')
const upload = multer({
  dest: 'uploads/'
})

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// require in custom errors
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

// define requireToken method to validate that the user is signed in
const requireToken = passport.authenticate('bearer', { session: false })

// Create route
router.post('/uploads', requireToken, upload.single('image'), (req, res, next) => {
  // const title = req.body.title
  // console.log(req.file.originalname)
  s3Upload(req.file)
    .then((data) => {
      //using a virtual setter
      User.findById(req.user.id)
        .then(user => {
          user.imageTitle = data.Key
          user.imageUrl = data.Location
          user.save()
          res.status(201).json({imageUrl: user.imageUrl})
        })
    })
    .catch(next)
})

// INDEX route
router.get('/uploads', requireToken, (req, res, next) => {
  const imageUrlArray = []
  User.find()
    .then(users => users.forEach(user => imageUrlArray.push(user.imageUrl)))
    .then(() => res.status(200).json({imageUrls: imageUrlArray}))
    .catch(next)
})

// UPDATE route
router.patch('/uploads', requireToken, upload.single('image'), (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      s3Delete(user.imageTitle)
      return user
    })
    .then(user => {
      s3Upload(req.file)
        .then(data => {
          user.imageTitle = data.Key
          user.imageUrl = data.Location
          user.save()
          res.status(201).json({imageUrl: user.imageUrl})
        })
    })
})

// DELETE route
router.delete('/uploads', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      s3Delete(user.imageTitle)
      user.imageTitle = ''
      user.imageUrl = 'false'
      user.save()
      res.status(204)
    })
    .catch(next)
})

module.exports = router
