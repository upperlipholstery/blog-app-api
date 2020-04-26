const mongoose = require('mongoose')
const note = require('./note')
const tomeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  notes: [note.schema],
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

module.exports = {
  model: mongoose.model('Tome', tomeSchema),
  schema: tomeSchema
}
