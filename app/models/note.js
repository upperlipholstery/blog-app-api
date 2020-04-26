const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ownerName: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = {
  model: mongoose.model('Note', noteSchema),
  schema: noteSchema
}
