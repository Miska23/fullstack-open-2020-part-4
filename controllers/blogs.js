const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
// const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({}).populate('user', { username: 1 })
    response.json(blogs.map(blog => blog.toJSON()))
  } catch (error) {
    next(error)
  }

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

})

blogsRouter.post('/', async (request, response, next) => {

  let decodedToken = null
  try {
    decodedToken = jwt.verify(request.token, process.env.TOKEN_SECRET)
  } catch (error) {
    next(error)
  }

  if (decodedToken && decodedToken.id) {
    const { body } = request

    const user = await User.findById(decodedToken.id)

    const userId = user._id

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: userId
    })

    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.status(201).json(savedBlog.toJSON())
    } catch (error) {
      next(error)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {

  //* token selville
  let decodedToken = null
  try {
    decodedToken = jwt.verify(request.token, process.env.TOKEN_SECRET)
  } catch (error) {
    next(error) //* jos token on virheellinen
  }

  //* kaikki tästä eteenpäin tehdään vain jos ehdot täyttyvät
  if (decodedToken && decodedToken.id) {

    //* etsitään pyynnön tehnyt käyttäjä (on olio)
    const user = await User.findById(decodedToken.id)
    const userId = user._id

    const blogId = request.params.id

    try {
      //* etsitään blogia urlin id-osan perusteella
      const blogToDelete = await Blog.findById(blogId)

      //* jos blogi löytyy
      if (blogToDelete) {

        //* verrataan url:n määrämän blogin useria ja pyynnön tehnyttä useria
        if ( blogToDelete.user.toString() === userId.toString() ) {

          //* yritetään poistaa
          try {
            const deletedBlog = await Blog.findByIdAndRemove(blogId)

            if (deletedBlog) {
              response.status(204).end()
            }

          //* jos poisto epäonnistuu
          } catch (error) {
            next(error)
          }

        } else { //* jos token on valid mutta siihen liittyvä user on eri kuin poistettavan blogin user
          response.status(401).end()
        }

      //* jos blogia ei löydy (eli ei olem. oleva valid id)
      } else {
        response.status(404).end()
      }

    //* jos id on malformatted eli esim. liian lyhyt
    } catch (error) {
      next(error)
    }

  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  const id = request.params.id
  const { body } = request

  //! vain likejen päivittäminen on mahdollista
  //! pyyntö ei feilaa jos annetaan muita tietoja bodyssa mutta ne eivät muutu
  const updatedInfo = {
    likes: body.likes === undefined ? 0 : body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, { runValidators: true, context: 'query', new: true })
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }

})

module.exports = blogsRouter