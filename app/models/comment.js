const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  owner: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true
  }
}, {
  timestamps: true
})

module.exports = {
   model: mongoose.model('Comment', commentSchema),
   schema: commentSchema
}
