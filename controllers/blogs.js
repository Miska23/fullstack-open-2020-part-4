const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const logger = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
  // logger.info('blogsRouter.get is used')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
})

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

//! virheellinen post ei johda error-vastaukseen vaan konsoliin tulee validationerror
blogsRouter.post('/', (request, response) => {
  const { body } = request
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })

  blog
    .save()
    .then(result => {
      response.status(201).json(result.toJSON())
    })
})

module.exports = blogsRouter