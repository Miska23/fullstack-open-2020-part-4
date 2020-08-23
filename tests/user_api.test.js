const mongoose = require('mongoose')
const User = require('../models/User')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('../utils/user_api_helper')
// const logger = require('../utils/logger')

describe('when there are some users saved in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  test('users are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all users are returned', async () => {
    const response = await api.get('/api/users')
    const initialLength = helper.initialUsers.length
    expect(response.body).toHaveLength(initialLength)
  })

  test('the username of first user is Miska23', async () => {
    const response = await api.get('/api/users')
    expect(response.body[0].username).toBe('Miska23')
  })

  test('all users should have a username ', async () => {
    const response = await api.get('/api/users')
    //* jos yhdenkin arrayn elementin property on undefined, funktio palauttaa true
    expect(helper.isPropertyOfEveryElementNotUndefined(response.body, 'username')).toBeTruthy()
  })
})
describe('saving a user to database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUsers)
  })

  test('is successful with valid data', async () => {
    const newUser = {
      username: 'Masa',
      name: 'Matti Virtanen',
      password: 'enKerro'
    }
    const newUsername = newUser.username

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfterAddition = await helper.usersInDatabase()

    expect(usersAfterAddition).toHaveLength(helper.initialUsers.length + 1)

    const userNames = usersAfterAddition.map(u => u.username)
    expect(userNames).toContain(newUsername)
  })

  test('fails with status code 400 if password is invalid', async () => {
    const newInvalidUser = {
      username: 'Pena666',
      name: 'Pentti Koskelainen'
    }

    const result = await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password')

    const usersAfterFailedAddition = await helper.usersInDatabase()

    expect(usersAfterFailedAddition).toHaveLength(helper.initialUsers.length)
  })

  test('fails with status code 400 and valid error message if username is already taken', async () => {
    const newInvalidUser = {
      username: 'Miska23',
      name: 'Miska Lattu',
      password: 'Secret#23'
    }

    const result = await api
      .post('/api/users')
      .send(newInvalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAfterFailedAddition = await helper.usersInDatabase()

    expect(usersAfterFailedAddition).toHaveLength(helper.initialUsers.length)
  })
})

afterAll(async () => {
  await mongoose.disconnect()
})