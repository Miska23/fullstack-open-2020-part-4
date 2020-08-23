const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const User = require('../models/User')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const blogsHelper = require('../utils/blog_api_helper_blogs')
const userHelper = require('../utils/blog_api_helper_users')


describe('when there are some blogs saved in database', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    const initialLength = blogsHelper.initialBlogs.length
    expect(response.body).toHaveLength(initialLength)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })

  test('all blogs should have an "id" property', async () => {
    const response = await api.get('/api/blogs')
    //* jos yhdenkin arrayn elementin property on undefined, funktio palauttaa true
    expect(blogsHelper.isPropertyOfEveryElementNotUndefined(response.body, 'id')).toBeTruthy()
  })
})

describe('requesting a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()
  })

  test('is successful with a valid id', async () => {
    const initialBlogs = await blogsHelper.blogsInDatabase()
    const blogToView = initialBlogs[0]

    const result = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(result.body.title).toEqual(blogToView.title)
  })

  test('fails with an invalid id', async () => {
    const initialBlogs = await blogsHelper.blogsInDatabase()
    const blogToView = initialBlogs[0]

    const invalidId = blogToView.id.slice(0, -1) + 'ö'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})

describe('saving a blog to database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()

    await api
      .post('/api/users')
      .send(userHelper.newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('is successful with valid data', async () => {

    const successfulLogin = await api
      .post('/api/login')
      .send(userHelper.newUserLogin)
      .expect(200)

    const { token } = successfulLogin.body

    const authorization = `bearer ${token}`

    const newBlog = blogsHelper.blogToSaveSuccessfully
    const newBlogTitle = newBlog.title

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddition = await blogsHelper.blogsInDatabase()

    const lengthAfterOneAddition = blogsHelper.initialBlogs.length + 1
    expect(blogsAfterAddition).toHaveLength(lengthAfterOneAddition)

    const titles = blogsAfterAddition.map(r => r.title)
    expect(titles).toContain(newBlogTitle)
  })

  test('without likes sets likes to 0', async () => {

    const successfulLogin = await api
      .post('/api/login')
      .send(userHelper.newUserLogin)
      .expect(200)

    const { token } = successfulLogin.body

    const authorization = `bearer ${token}`

    const newBlog = blogsHelper.blogWithoutLikes

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddition = await blogsHelper.blogsInDatabase()

    const lengthAfterOneAddition = blogsHelper.initialBlogs.length + 1
    expect(blogsAfterAddition).toHaveLength(lengthAfterOneAddition)

    const indexOfNewBlog = blogsAfterAddition.length -1
    expect(blogsAfterAddition[indexOfNewBlog].likes).toBe(0)
  })

  test('fails with status code 400 if data in blog is invalid', async () => {

    const successfulLogin = await api
      .post('/api/login')
      .send(userHelper.newUserLogin)
      .expect(200)

    const { token } = successfulLogin.body

    const authorization = `bearer ${token}`

    const newBlog = blogsHelper.invalidBlog

    await api
      .post('/api/blogs')
      .set('Authorization', authorization)
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAfterFailedAddition = await blogsHelper.blogsInDatabase() //* tässä kohtaa pituus edelleen  === 4

    expect(blogsAfterFailedAddition).toHaveLength(blogsHelper.initialBlogs.length)
  })
})

//! ei refaktoroitu toimimaan login-toiminnon lisäämisen jälkeen
/* describe('deleting a single blog', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()

    await api
      .post('/api/users')
      .send(userHelper.newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('is successful if a valid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialBlogs = await blogsHelper.blogsInDatabase()
    const blogToDelete = initialBlogs[0]

    //* poisto
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAfterDeletion = await blogsHelper.blogsInDatabase()

    const lengthAfterOneRemoval = blogsHelper.initialBlogs.length - 1
    expect(blogsAfterDeletion).toHaveLength(lengthAfterOneRemoval)

    const titles = blogsAfterDeletion.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)

  })
}) */

describe('updating a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(blogsHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(blogsHelper.initialBlogs[1])
    await blogObject.save()
  })
  test('is successful with a valid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialBlogs = await blogsHelper.blogsInDatabase()
    const blogToUpdate = initialBlogs[0]

    const updatedBlogBody = {
      likes: 3
    }

    //* päivitys
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogBody)
      .expect(200)

    const blogsAfterUpdating = await blogsHelper.blogsInDatabase()

    expect(blogsAfterUpdating).toHaveLength(blogsHelper.initialBlogs.length)

    const updatedLikes = blogsAfterUpdating[0].likes
    expect(updatedLikes).toBe(updatedBlogBody.likes)

  })

  test('fails with an invalid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialBlogs = await blogsHelper.blogsInDatabase()
    const blogToUpdate = initialBlogs[0]

    const updatedBlogBody = {
      likes: 3
    }

    const invalidId = blogToUpdate.id.slice(0, -1) + 'ö'

    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlogBody)
      .expect(400)

    const blogsAfterUpdating = await blogsHelper.blogsInDatabase()

    expect(blogsAfterUpdating).toHaveLength(blogsHelper.initialBlogs.length)

    const failedUpdatedLikes = blogsAfterUpdating[0].likes //* muutettu on edelleen listan ensimmäinen
    expect(failedUpdatedLikes).toBe(blogToUpdate.likes)

  })
})

afterAll(async () => {
  await mongoose.disconnect()
})