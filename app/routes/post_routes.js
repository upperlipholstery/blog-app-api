// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Post = require('../models/post').model
const User = require('../models/user')

const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /posts
router.get('/posts', (req, res, next) => {
  const postsArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => postsArray.push(user.posts)))
    .then(() => [].concat.apply([], postsArray))
    .then(flatPosts => res.status(200).json({posts: flatPosts}))
    .catch(next)
})

// SHOW
// GET /posts/5a7db6c74d55bc51bdf39793
router.get('/posts/:id', (req, res, next) => {
  const postsArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => postsArray.push(user.posts)))
    .then(() => [].concat.apply([], postsArray))
    .then(flatPosts =>  flatPosts.filter(post => post._id == req.params.id))
    .then(post => res.status(200).json({ post }))
})

// CREATE
// POST /posts
router.post('/posts', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  User.findById(req.user.id)
    .then(handle404)
    .then(user => {
        req.body.post.owner = {}
        req.body.post.owner._id = req.user.id
        req.body.post.owner.email = req.user.email
        user.posts.push(req.body.post)
        return user.save()
    })
    .then(user => {
      res.status(201).json({post: user.posts[user.posts.length-1].toObject()})
    })
    .catch(next)
})

// UPDATE
// PATCH /posts/5a7db6c74d55bc51bdf39793
router.patch('/posts/:id', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.posts.id(req.params.id))
    .then(post => {
      requireOwnership(req, post)
      post.title = req.body.post.title
      post.body = req.body.post.body
      return post.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

// DESTROY
// DELETE /posts/5a7db6c74d55bc51bdf39793
router.delete('/posts/:id', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.posts.id(req.params.id))
    .then(handle404)
    .then(post => {
      console.log(post)
      console.log(req.user.id)
      requireOwnership(req, post)
      post.remove()
      post.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

module.exports = router
