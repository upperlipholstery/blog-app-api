// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Comment = require('../models/comment').model
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
  Comment.find().populate('owner', '-token -posts -__v -createdAt -updatedAt')
    .then(comments => {
      return comments.map(comment => comment.toObject())
    })
    .then(comments => res.status(200).json({ comments: comments }))
    .catch(next)
})

// SHOW
// GET /comments/5a7db6c74d55bc51bdf39793
router.get('/comments/:id', (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Comment.findById(req.params.id).populate('owner', '-token -posts -__v -createdAt -updatedAt')
    .then(handle404)
    // if `findById` is succesful, respond with 200 and "example" JSON
    .then(comment => res.status(200).json({ comment: comment.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
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
        console.log(req.body)
        post.comments.push(req.body.comment)
        console.log(post.parent())
        return post.parent().save()
    })
    .then(post => {
      console.log(post)
      res.status(201).json({comment: post.toObject()})
    })
    .catch(next)
})
//   Post.findOne({_id: req.body.comment.postId}, function(err, post)
//   {
//     console.log(post)
//     console.log('------------split---------------')
//     console.log(req.body)
//     if(err)
//     { res.sendStatus(500).send('database error').end()}
//     else if(!post)
//     { res.sendStatus(404).send('post was not found').end() }
//     else
//     {
//       req.body.comment.ownerName = req.user.email
//       delete req.body.comment.postId
//       console.log('------------split---------------')
//       console.log(req.body)
//       post.comments.push({ownerName: email, body: req.body.comment.body, owner: req.body.comment.owner})
//       Comment.create(req.body.comment)
//         // respond to succesful `create` with status 201 and JSON of new "example"
//         .then(comment => {
//           res.status(201).json({ comment: comment.toObject() })
//         })
//         // if an error occurs, pass it off to our error handler
//         // the error handler needs the error message and the `res` object so that it
//         // can send an error message back to the client
//         .catch(next)
//         post.markModified('comments')
//         post.save()
//     }
//   })
// })

// UPDATE
// PATCH /comments/5a7db6c74d55bc51bdf39793
router.patch('/comments/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.comment.owner

  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, comment)

      // pass the result of Mongoose's `.update` to the next `.then`
      return comment.updateOne(req.body.comment)
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /comments/5a7db6c74d55bc51bdf39793
router.delete('/comments/:id', requireToken, (req, res, next) => {
  Comment.findById(req.params.id)
    .then(handle404)
    .then(comment => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, comment)
      // delete the example ONLY IF the above didn't throw
      comment.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
