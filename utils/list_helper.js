
const _ = require('lodash')

const logger = require('./logger')


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

const mostBlogs = function(blogs) {
  const countBy = _.countBy(blogs, 'author')

  const bloggerArray = []
  for (const key in countBy) {
    const bloggerObject =
    { author: key,
      blogs: countBy[key]
    }
    bloggerArray.push(bloggerObject)
  }

  const reduced = bloggerArray.reduce((acc, current) => {
    return acc.blogs > current.blogs ? acc : current
  })

  return reduced

}

const mostLikes = function(blogs) {
  const groupBy = _.groupBy(blogs, 'author')

  const bloggerArray = []

  for (const key in groupBy) {
    const bloggerObject = //! joka kierroksella uusi olio
    { author: key,        //! joka kierroksella author-ominaisuudeksi nimi groupBy-oliosta
      likes: groupBy[key].reduce((acc, cur) => { //! groupBy[key] = jokaista nimeä vastaava lista blogiolioista
        logger.info('acc is: ', acc)
        return acc + cur.likes
      }, 0) //! annettava initialValue, koska muutoin ekalla kierroksella lisätään oliotyyppi string-tyyppiin
    }
    bloggerArray.push(bloggerObject)
  }

  const reduced = bloggerArray.reduce((acc, cur) => {
    return acc.likes > cur.likes ? acc : cur
  })

  return reduced

}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

