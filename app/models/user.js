const mongoose = require('mongoose')
const tome = require('./tome')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  imageUrl: String,
  imageTitle: String,
  tomes: [tome.schema],
  numFavs: Number,
  numLikes: Number,
  numNotes: Number,
  likedTomes: {
    type: Array
  },
  favTomes: {
    type: Array
  },
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
