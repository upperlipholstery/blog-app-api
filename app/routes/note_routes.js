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
// GET /notes
router.get('/notes', (req, res, next) => {
  const tomesArray = []
  const notesArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(tomes => tomes.forEach(tome => {
      if (tome.notes.length) {
        notesArray.push(tome.notes)
      }
    }))
    .then(() => [].concat.apply([], notesArray))
    .then(notes => res.status(200).json({notes}))
})

// SHOW
// GET /tomes/5a7db6c74d55bc51bdf39793
router.get('/notes/:id', (req, res, next) => {
  const tomesArray = []
  const notesArray = []
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(tomes => tomes.forEach(tome => {
      if (tome.notes.length) {
        notesArray.push(tome.notes)
      }
    }))
    .then(() => [].concat.apply([], notesArray))
    .then(flatNotes => flatNotes.filter(note => note._id == req.params.id))
    .then(note => res.status(200).json({note}))
})

// CREATE
// note /notes
router.post('/notes', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  // const tomeId = req.body.note.tomeId
  const tomesArray = []
  let ownerOfTome
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(flatTomes => flatTomes.filter(tome => tome._id == req.body.note.tomeId))
    .then(tomeFound => ownerOfTome = tomeFound[0].owner._id)
    .then(() => User.findById(ownerOfTome))
    .then(user => user.tomes.id(req.body.note.tomeId))
    .then(tome => {
      delete req.body.note.tomeId
      req.body.note.owner = req.user.id
      req.body.note.ownerName = req.user.email
      tome.notes.push(req.body.note)
      return tome.parent().save()
    })
    .then(tome => {
      res.status(201).json({tome})
    })
    .catch(next)
})

// UPDATE
// PATCH /tomes/5a7db6c74d55bc51bdf39793
router.patch('/notes/:id', requireToken, removeBlanks, (req, res, next) => {
  const tomesArray = []
  let ownerOfTome
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(flatTomes => flatTomes.filter(tome => tome._id == req.body.note.tomeId))
    .then(tomeFound => ownerOfTome = tomeFound[0].owner._id)
    .then(() => User.findById(ownerOfTome))
    .then(handle404)
    .then(user => user.tomes.id(req.body.note.tomeId))
    .then(tome => tome.notes.id(req.params.id))
    .then(note => {
      // to get show ownership to work, note.owner => note.owner._id, because requireOwnership is picky
      requireOwnership(req, note)
      note.body = req.body.note.body
      return note.parent().parent().save()
    })
    .then(() => res.sendStatus(204))
})

// DESTROY
// DELETE /notes/5a7db6c74d55bc51bdf39793
router.delete('/notes/:id', requireToken, (req, res, next) => {
  const tomesArray = []
  let ownerOfTome
  User.find()
    .then(handle404)
    .then(users => users.forEach(user => tomesArray.push(user.tomes)))
    .then(() => [].concat.apply([], tomesArray))
    .then(flatTomes => flatTomes.filter(tome => tome._id == req.body.note.tomeId))
    .then(tomeFound => ownerOfTome = tomeFound[0].owner._id)
    .then(() => User.findById(ownerOfTome))
    .then(handle404)
    .then(user => user.tomes.id(req.body.note.tomeId))
    .then(tome => tome.notes.id(req.params.id))
    .then(note => {
      // to get show ownership to work, note.owner => note.owner._id, because requireOwnership is picky
      requireOwnership(req, note)
      note.remove()
      return note.parent().parent().save()
    })
    .then(() => res.sendStatus(204))
})

module.exports = router
