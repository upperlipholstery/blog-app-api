const express = require('express')

const passport = require('passport')

const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

router.get('/likes', requireToken, (req, res, next) => {
  const likesArray = []
  User.find()
    .then(users => {console.log(req.user) ; console.log(req.user.id) ; users.forEach(user => likesArray.push(user.tomes))})
    .then(() => [].concat.apply([], likesArray))
    .then(flatTomes => flatTomes.filter(flatTome => req.user.likedTomes.includes(flatTome._id.toString())))
    .then(likedTomes => res.status(200).json({likedTomes}))
    .catch(next)
})

router.post('/likes/:id', requireToken, (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user.likedTomes.includes(req.params.id.toString())) {
        //editing currenly logged in user to add tome to likes
        user.likedTomes.push(req.params.id)
        user.save()
        const tomesArray = []
        //adding 1 to #likes on tome
        User.find()
          .then(users => users.forEach(person => tomesArray.push(person.tomes)))
          .then(() => [].concat.apply([], tomesArray))
          .then(flatTomes => flatTomes.filter(tome => tome._id == req.params.id)[0])
          .then(tome => {
            tome.likes = tome.likes + 1
            tome.parent().save()
            res.sendStatus(200)
          })
      } else {
        //editing currenly logged in user to remove tome from likes
        user.likedTomes = user.likedTomes.filter(fav => fav !== req.params.id)
        user.save()
        const tomesArray = []
        //removing 1 from #likes on tome
        User.find()
          .then(users => users.forEach(person => tomesArray.push(person.tomes)))
          .then(() => [].concat.apply([], tomesArray))
          .then(flatTomes => flatTomes.filter(tome => tome._id == req.params.id)[0])
          .then(tome => {
            tome.likes = tome.likes - 1
            tome.parent().save()
            res.sendStatus(204)
          })
      }
    })
    .catch(next)
})

module.exports = router
