const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    minlength: 3,
    required: true
  },
  url: {
    type: String,
    minlength: 8,
    required: true,
    unique: true
  },
  likes: {
    type: Number,
    min: 0,
    required: true
  }
})

blogSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Blog', blogSchema)
