const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
// const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (error) {
    next(error)
  }
/*   Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(blog => blog.toJSON()))
    })
    .catch((error) => next(error)) */
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog.toJSON())
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
/*   Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error)) */
})

blogsRouter.post('/', async (request, response, next) => {
  const { body } = request
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes
  })

  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog.toJSON())
  } catch (error) {
    next(error)
  }
/*   blog
    .save()
    .then((result) => {
      response.status(201).json(result.toJSON())
    })
    .catch((error) => next(error)) */
})

//* 4.13
blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const deletedBlog = await Blog.findByIdAndRemove(id)
    if (deletedBlog) {
      response.status(204).end()
    }
  } catch (error) {
    next(error)
  }
/*   Blog
    .findByIdAndRemove(id)
    .then((result) => {
      if (result) {
        response.status(204).end()
      }
    })
    .catch(error => next(error)) */
})

//* 4.14
blogsRouter.put('/:id', async (request, response, next) => {

  const id = request.params.id
  const { body } = request

  //* vain likejen päivittäminen on mahdollista
  //* pyyntö ei feilaa jos annetaan muita tietoja bodyssa mutta ne eivät muutu
  const updatedInfo = {
    likes: body.likes === undefined ? 0 : body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, { runValidators: true, context: 'query', new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }

/*   Blog.findByIdAndUpdate(id, updatedInfo, { runValidators: true, context: 'query', new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error)) */
})

module.exports = blogsRouter