// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /comments
router.get('/comments', (req, res, next) => {
  const postsArray = []
  const commentsArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => postsArray.push(user.posts)))
    .then(() => [].concat.apply([], postsArray))
    .then(posts => posts.forEach(post => {
        if(post.comments.length){
          commentsArray.push(post.comments)
        }
      }))
    .then(() => [].concat.apply([], commentsArray))
    .then(comments => res.status(200).json({comments}))
})

// SHOW
// GET /posts/5a7db6c74d55bc51bdf39793
router.get('/comments/:id', (req, res, next) => {
  const postsArray = []
  const commentsArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => postsArray.push(user.posts)))
    .then(() => [].concat.apply([], postsArray))
    .then(posts => posts.forEach(post => {
        if(post.comments.length){
          commentsArray.push(post.comments)
        }
      }))
    .then(() => [].concat.apply([], commentsArray))
    .then(flatComments => flatComments.filter(comment => comment._id == req.params.id))
    .then(comment => res.status(200).json({comment}))
})

// CREATE
// comment /comments
router.post('/comments', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  // const postId = req.body.comment.postId
  User.findById(req.user.id)
    .then(user => user.posts.id(req.body.comment.postId))
    .then(post => {
        delete req.body.comment.postId
        req.body.comment.owner = req.user.id
        req.body.comment.ownerName = req.user.email
        post.comments.push(req.body.comment)
        return post.parent().save()
    })
    .then(post => {
      res.status(201)
    })
    .catch(next)
})

// UPDATE
// PATCH /posts/5a7db6c74d55bc51bdf39793
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.posts.id(req.body.comment.postId))
    .then(post => post.comments.id(req.params.id))
    .then(comment => {
      // to get show ownership to work, comment.owner => comment.owner._id, because requireOwnership is picky
      requireOwnership(req, comment)
      comment.body = req.body.comment.body
      return comment.parent().parent().save()
    })
    .then(() => res.sendStatus(204))
})

// DESTROY
// DELETE /comments/5a7db6c74d55bc51bdf39793
router.delete('/comments/:id', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.posts.id(req.body.comment.postId))
    .then(post => post.comments.id(req.params.id))
    .then(comment => {
      // to get show ownership to work, comment.owner => comment.owner._id, because requireOwnership is picky
      requireOwnership(req, comment)
      comment.remove()
      return comment.parent().parent().save()
    })
    .then(() => res.sendStatus(204))
})

module.exports = router
