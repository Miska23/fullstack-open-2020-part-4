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

    const usersAfterAddition = await helper.usersInDatabase() //* tässä kohtaa pituus === 3

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


/* describe('requesting a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialUsers[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialUsers[1])
    await blogObject.save()
  })

  test('is successful with a valid id', async () => {
    const initialUsers = await helper.blogsInDatabase()
    const blogToView = initialUsers[0]

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.title).toEqual(blogToView.title)
  })

  test('fails with an invalid id', async () => {
    const initialUsers = await helper.blogsInDatabase()
    const blogToView = initialUsers[0]

    const invalidId = blogToView.id.slice(0, -1) + 'ö'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

*/

/* describe('deleting a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialUsers[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialUsers[1])
    await blogObject.save()
  })
  //* 4.13
  test('is successful with a valid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialUsers = await helper.blogsInDatabase()
    const blogToDelete = initialUsers[0]

    //* poisto
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDeletion = await helper.blogsInDatabase() //* tässä kohtaa pituus === 1

    const lengthAfterOneRemoval = helper.initialUsers.length - 1
    expect(blogsAfterDeletion).toHaveLength(lengthAfterOneRemoval)

    const titles = blogsAfterDeletion.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)

  })
})

describe('updating a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialUsers[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialUsers[1])
    await blogObject.save()
  })
  //* 4.14
  test('is successful with a valid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialUsers = await helper.blogsInDatabase()
    const blogToUpdate = initialUsers[0]

    const updatedBlogBody = {
      likes: 3
    }

    //* päivitys
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogBody)
      .expect(200)

    //* kaikkien hakeminen muutoksen jälkeen
    const blogsAfterUpdating = await helper.blogsInDatabase()

    expect(blogsAfterUpdating).toHaveLength(helper.initialUsers.length)

    const updatedLikes = blogsAfterUpdating[0].likes //* muutettu on edelleen listan ensimmäinen
    expect(updatedLikes).toBe(updatedBlogBody.likes)

  })

  //* 4.14
  test('fails with an invalid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialUsers = await helper.blogsInDatabase()
    const blogToUpdate = initialUsers[0]

    const updatedBlogBody = {
      likes: 3
    }

    const invalidId = blogToUpdate.id.slice(0, -1) + 'ö'

    //* päivitys
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlogBody)
      .expect(400)

    //* kaikkien hakeminen muutoksen jälkeen
    const blogsAfterUpdating = await helper.blogsInDatabase()

    expect(blogsAfterUpdating).toHaveLength(helper.initialUsers.length)

    const failedUpdatedLikes = blogsAfterUpdating[0].likes //* muutettu on edelleen listan ensimmäinen
    expect(failedUpdatedLikes).toBe(blogToUpdate.likes)

  })
})  */

afterAll(async () => {
  //* alkup. oli: await mongoose.connection.close()
  await mongoose.disconnect()
})