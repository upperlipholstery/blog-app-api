const express = require('express')

const passport = require('passport')

const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.get('/favorites', requireToken, (req, res, next) => {
  const favoritesArray = []
  User.find()
    .then(users => users.forEach(user => favoritesArray.push(user.tomes)))
    .then(() => [].concat.apply([], favoritesArray))
    .then(flatTomes => flatTomes.filter(flatTome => req.user.favTomes.includes(flatTome._id.toString())))
    .then(favTomes => res.status(200).json({favTomes}))
    .catch(next)
})

router.post('/favorites/:id', requireToken, (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user.favTomes.includes(req.params.id.toString())) {
        user.favTomes.push(req.params.id)
        const tomesArray = []
        User.find()
          .then(users => users.forEach(person => tomesArray.push(person.tomes)))
          .then(() => [].concat.apply([], tomesArray))
          .then(flatTomes => flatTomes.filter(tome => tome._id == req.params.id)[0])
          .then(tome => {
            User.findById(tome.owner._id)
              .then(person => {
                person.numFavs++
                person.save()
              })
          })
        user.save()
        res.sendStatus(200)
      } else {
        user.favTomes = user.favTomes.filter(fav => fav !== req.params.id)
        const tomesArray = []
        User.find()
          .then(users => users.forEach(person => tomesArray.push(person.tomes)))
          .then(() => [].concat.apply([], tomesArray))
          .then(flatTomes => flatTomes.filter(tome => tome._id == req.params.id)[0])
          .then(tome => {
            User.findById(tome.owner._id)
              .then(person => {
                person.numFavs--
                person.save()
              })
          })
        user.save()
        res.sendStatus(204)
      }
    })
    .catch(next)
})

module.exports = router
