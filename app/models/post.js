const mongoose = require('mongoose')
const comment = require('./comment')
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
  comments: [comment.schema],
  owner: {
    type: String,
    required: true
  }}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('Post', postSchema),
  schema: postSchema
}
