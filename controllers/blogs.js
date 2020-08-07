const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const logger = require('../utils/logger')

//TODO: async / await .thenien tilalle

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
    .catch((error) => next(error))
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

blogsRouter.post('/', (request, response, next) => {
  const { body } = request
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })

  blog
    .save()
    .then((result) => {
      response.status(201).json(result.toJSON())
    })
    .catch((error) => next(error))
})

//* 4.13
blogsRouter.delete('/:id', (request, response, next) => {
  const id = request.params.id
  Blog
    .findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      }
    })
    .catch(error => next(error))
})

//* 4.14
blogsRouter.put('/:id', (request, response, next) => {

  const id = request.params.id
  const { body } = request

  //* vain likejen päivittäminen on mahdollista
  //* pyyntö ei feilaa jos annetaan muita tietoja bodyssa mutta ne eivät muutu
  const updatedInfo = {
    likes: body.likes === undefined ? 0 : body.likes
  }

  Blog.findByIdAndUpdate(id, updatedInfo, { runValidators: true, context: 'query', new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})


module.exports = blogsRouter