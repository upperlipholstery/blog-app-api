const mongoose = require('mongoose')
const comment = require('comment')

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    required: true
  },
  comments: [comment]
}, {
  timestamps: true
})

module.exports = mongoose.model('Post', postSchema)
