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
      User.findById(req.user.id)
        .then(user => user.imageUrl = data.Location)
      return data.Location
    })
    .then(upload => res.status(201).json({
      imageUrl: upload
    }))
    .catch(next)
})

// // INDEX route
// router.get('/uploads', requireToken, (req, res, next) => {
//   const imageUrlArray = []
//   User.find()
//     .then(users => users.forEach(user => tomesArray.push(user.tomes)))
//     .then(() => [].concat.apply([], tomesArray))
//     .then(flatTomes => res.status(200).json({tomes: flatTomes}))
//     .catch(next)
// })
//
//
//
// router.get('/uploads', requireToken, (req, res, next) => {
//   Upload.find()
//     .then(uploads => {
//       return uploads.map(upload => upload.toObject())
//     })
//     // respond with status 200 and JSON of the uploads
//     .then(uploads => res.status(200).json({ uploads: uploads }))
//     // if an error occurs, pass it to the handler
//     .catch(next)
// })
//
// // UPDATE route
// router.patch('/uploads/:id', requireToken, upload.single('image'), (req, res, next) => {
//   Upload.findById(req.params.id)
//     .then(handle404)
//     .then(upload => {
//       requireOwnership(req, upload)
//       return upload
//     })
//
//     .then(upload => {
//       upload.tag = req.body.tag
//       upload.save()
//       return upload
//     })
//     .then(upload => {
//       res.status(200).json({
//         upload: upload.toObject()
//       })
//     })
//     .catch(next)
// })
//
// // DELETE route
// router.delete('/uploads/:id', requireToken, (req, res, next) => {
//   Upload.findById(req.params.id)
//     .then(handle404)
//     .then(upload => {
//       requireOwnership(req, upload)
//       return upload
//     })
//     .then(upload => {
//       s3Delete(req.body.title)
//       return upload
//     })
//     .then(upload => {
//       upload.deleteOne()
//     })
//     .then(() => res.sendStatus(204))
//     .catch(next)
// })

module.exports = router
