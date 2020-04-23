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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date:{
    calender: String,
    time: String
  }
}, {
  timestamps: true,
  toJSON: {virtuals: true}

})

postSchema.virtual('dateTime')
  .get(function(){ return this.createdAt })
  .set(function(dT){
    const calender = dT.substring(0, dT.indexOf('T1'))
    const time = dT.substring(dT.indexOf('T1'), dT.indexOf('.'))
    this.date.set({calender, time})
  })

module.exports = {
  model: mongoose.model('Post', postSchema),
  schema: postSchema
}
