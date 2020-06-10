const testBlogs = require('../utils/testBlogs')


const dummy = () => {
  return 1
}
const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  } else {
    return blogs.reduce((accumulator, blog) => {
      return accumulator + blog.likes
    }, 0)
  }
}
const favoriteBlog = function(blogs) {
  return blogs.reduce(function(mostVotes, current) {
    return mostVotes.likes > current.likes ? mostVotes : current
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

