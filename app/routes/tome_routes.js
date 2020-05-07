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
// GET /tomes
router.get('/tomes', (req, res, next) => {
  const tomesArray = []
  User.find()
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(flatTomes => {
      flatTomes.map(tome => {
        tome.notes.map(async (note) => {
          try {
            let user = await User.findById(note.owner)
            note.imageUrl = user.imageUrl
            // let saved = await tome.parent().save()
            console.log(note, 'in code')
          } catch (err) {
            console.log(err)
          }
          // console.log(note,'spot 1')
          //   .then(user => {
          //     note.imageUrl = user.imageUrl
          //   })
          // console.log(note, 'note')
          // tome.parent().save()
          return note
        })
        tome.avatarUrl = tome.parent().imageUrl
        return tome
        // console.log(note, 'spot 2')
        // tome.parent().save()
      })
      return flatTomes
    })
    .then(flatTomes => {flatTomes.forEach(tome => tome.notes.forEach(note => console.log(note))) ; return flatTomes})
    .then(flatTomes => res.status(200).json({tomes: flatTomes}))
    .catch(next)
})

// SHOW
// GET /tomes/5a7db6c74d55bc51bdf39793
router.get('/tomes/:id', (req, res, next) => {
  const tomesArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(flatTomes => flatTomes.map(tome => {
      tome.avatarUrl = tome.parent().imageUrl
      return tome
    }))
    .then(flatTomes => flatTomes.filter(tome => tome._id == req.params.id))
    .then(tome => {
      tome[0].notes.map(note => {
        User.findById(note.owner)
          .then(user => note.imageUrl = user.imageUrl)
        return tome
      })
      return tome
    })
    .then(tome => res.status(200).json({ tome }))
})

// CREATE
// POST /tomes
router.post('/tomes', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  User.findById(req.user.id)
    .then(handle404)
    .then(user => {
      req.body.tome.owner = {}
      req.body.tome.owner._id = req.user.id
      req.body.tome.owner.email = req.user.email
      req.body.tome.likes = 0
      user.tomes.push(req.body.tome)
      return user.save()
    })
    .then(user => {
      res.status(201).json({tome: user.tomes[user.tomes.length - 1].toObject()})
    })
    .catch(next)
})

// UPDATE
// PATCH /tomes/5a7db6c74d55bc51bdf39793
router.patch('/tomes/:id', requireToken, removeBlanks, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.tomes.id(req.params.id))
    .then(tome => {
      requireOwnership(req, tome)
      tome.title = req.body.tome.title
      tome.body = req.body.tome.body
      return tome.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

// DESTROY
// DELETE /tomes/5a7db6c74d55bc51bdf39793
router.delete('/tomes/:id', requireToken, (req, res, next) => {
  User.findById(req.user.id)
    .then(handle404)
    .then(user => user.tomes.id(req.params.id))
    .then(handle404)
    .then(tome => {
      console.log(tome)
      console.log(req.user.id)
      requireOwnership(req, tome)
      tome.remove()
      tome.parent().save()
    })
    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
})

module.exports = router
