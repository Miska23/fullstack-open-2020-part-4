const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users.map(user => user.toJSON()))
  } catch (error) {
    next(error)
  }
})

usersRouter.post('/', async (request, response, next) => {
  const { body } = request

  const saltRounds = 10
  console.log('[usersRouter.post], body.password: ', body.password)
  if (!body.password || body.password.length < 3) {
    return response.status(400).json({ error: 'invalid password' })
  } else {
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    console.log('[usersRouter.post], passwordHash: ', passwordHash)
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    try {
      const savedUser = await user.save()
      response.status(201).json(savedUser.toJSON())
    } catch (error) {
      next(error)
    }
  }
})

module.exports = usersRouter