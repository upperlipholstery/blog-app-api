const mongoose = require('mongoose')
const note = require('./note')
const User = require('./user')
const tomeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  imageUrl: String,
  notes: [note.schema],
  likes: Number,
  owner: {
    _id: {
      type: String
    },
    email: {
      type: String
    }
  }}, {
  timestamps: true
})

tomeSchema.virtual('avatarUrl')
  .set(function (url) {
    const imageUrl = url
    this.set({imageUrl})
  })

module.exports = {
  model: mongoose.model('Tome', tomeSchema),
  schema: tomeSchema
}
