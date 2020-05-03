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


// const userSchema = mongoose.Schema({
//   firstName: String,
//   lastName: String
// });
// // Create a virtual property `fullName` with a getter and setter.
// userSchema.virtual('fullName').
//   get(function() { return `${this.firstName} ${this.lastName}`; }).
//   set(function(v) {
//     // `v` is the value being set, so use the value to set
//     // `firstName` and `lastName`.
//     const firstName = v.substring(0, v.indexOf(' '));
//     const lastName = v.substring(v.indexOf(' ') + 1);
//     this.set({ firstName, lastName });
//   });
// const User = mongoose.model('User', userSchema);
//
// const doc = new User();
// // Vanilla JavaScript assignment triggers the setter
// doc.fullName = 'Jean-Luc Picard';
//
// doc.fullName; // 'Jean-Luc Picard'
// doc.firstName; // 'Jean-Luc'
// doc.lastName; // 'Picard'


module.exports = {
  model: mongoose.model('Tome', tomeSchema),
  schema: tomeSchema
}
