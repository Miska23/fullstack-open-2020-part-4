const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) //* nyt api-muuttujalla voi tehdä testejä

const helper = require('../utils/blog_api_helper')
// const logger = require('../utils/logger')

//* alustus eli talletus ilman POSTIa. "npm test" avaa yhteyden testitietokantaan, jolloin
//* operaatioiden kutsuminen Blog-modelilla käyttää operaatioihin sitä Mongo-tietokantaa,
//* johon ollaan yhdistettynä (eli samaan tapaan kuin tuotantomoodissa kontrollereiden avulla mutta
//* ilman määrättyä reittiä, jonka sisällä käytetään samaa modelia)


//* testeissä käytetään samoja kontrollereiden routeja kuin tuotantoversiossa
//* mutta koska tietokantayhteys on eri, niin routeilla haetaan tietoa testitietokannasta
//* Eli suoeragent-olio "api" käyttää tässä blogsRouteria .get-pyynnöllä, koska suluissa
//* annettu osoite vastaa app.js:ssä olevaa määrittelyä .use('/api/blogs', blogsRouter)
//* Reitti viittaa siis nyt testitietokannassa olevaan Blogs-kokoelmaan, koska yhteys
//* on avattu testitietokantaan

describe('when there are some blogs saved in database', () => {
  //* tehdään vain tämän lohkon alussa, minkä jälkeen tässä tallennetut blogit haetaan helper.blogsInDatabase-funktiolla
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
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
    const initialLength = helper.initialBlogs.length
    expect(response.body).toHaveLength(initialLength)
  })

  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].title).toBe('React patterns')
  })

  //* 4.9
  test('all blogs should have an "id" property', async () => {
    const response = await api.get('/api/blogs')
    //* jos yhdenkin arrayn elementin property on undefined, funktio palauttaa true
    expect(helper.isPropertyOfEveryElementNotUndefined(response.body, 'id')).toBeTruthy()
  })
})

describe('saving a blog to database', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })
  //* 4.10
  test('is successful with valid data', async () => {
    const newBlog = helper.blogToSaveSuccessfully
    const newBlogTitle = newBlog.title

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddition = await helper.blogsInDatabase() //* tässä kohtaa pituus === 3

    const lengthAfterOneAddition = helper.initialBlogs.length + 1
    expect(blogsAfterAddition).toHaveLength(lengthAfterOneAddition)

    const titles = blogsAfterAddition.map(r => r.title)
    expect(titles).toContain(newBlogTitle)
  })

  //* 4.11: jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0
  test('without likes sets likes to 0', async () => {
    const newBlog = helper.blogWithoutLikes

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfterAddition = await helper.blogsInDatabase() //* tässä kohtaa pituus === 3

    const lengthAfterOneAddition = helper.initialBlogs.length + 1
    expect(blogsAfterAddition).toHaveLength(lengthAfterOneAddition)

    const indexOfNewBlog = blogsAfterAddition.length -1 //* viimeiseksi tallennetun indeksi on aina pituus -1
    expect(blogsAfterAddition[indexOfNewBlog].likes).toBe(0)
  })

  //* 4.12
  test('fails with status code 400 if data is invalid', async () => {
    const newBlog = helper.invalidBlog

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const blogsAfterFailedAddition = await helper.blogsInDatabase() //* tässä kohtaa pituus edelleen  === 4

    expect(blogsAfterFailedAddition).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deleting a single blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
  })
  //* 4.13
  test('is successful with a valid id ', async () => {

    //* hakee beforeEachissa tallennetut blogit ja tekee niistä arrayn
    const initialBlogs = await helper.blogsInDatabase()
    const blogToDelete = initialBlogs[0]

    //* poisto
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    //* kaikkien hakeminen tallennuksen jälkeen eli initialBlogs - + 2 - 1
    const blogsAfterDeletion = await helper.blogsInDatabase() //* tässä kohtaa pituus === 1

    const lengthAfterOneRemoval = helper.initialBlogs.length - 1
    expect(blogsAfterDeletion).toHaveLength(lengthAfterOneRemoval)

    const titles = blogsAfterDeletion.map(blog => blog.title)
    expect(titles).not.toContain(blogToDelete.title)

  })
})

afterAll(async () => {
  //* alkup. oli: await mongoose.connection.close()
  await mongoose.disconnect()
})