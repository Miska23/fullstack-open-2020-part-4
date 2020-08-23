const User = require('../models/User')
const Blog = require('../models/Blog')

const newUser = {
  username: 'Masa',
  name: 'Matti Virtanen',
  password: 'enKerro'
}

const newUserLogin =  {
  username: newUser.username,
  password: newUser.password
}

const usersInDatabase = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const blogsInDatabase = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


module.exports = {
  newUser,
  newUserLogin,
  usersInDatabase,
  blogsInDatabase
}