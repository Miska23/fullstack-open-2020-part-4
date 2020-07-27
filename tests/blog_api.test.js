const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) //* nyt api-muuttujalla voi tehdä testejä

const testBlogs = require('../utils/testBlogs')
const logger = require('../utils/logger')

//* alustus eli talletus ilman POSTIa. "npm test" avaa yhteyden testitietokantaan, jolloin
//* operaatioiden kutsuminen Blog-modelilla käyttää operaatioihin sitä Mongo-tietokantaa,
//* johon ollaan yhdistettynä (eli samaan tapaan kuin tuotantomoodissa kontrollereiden avulla mutta
//* ilman määrättyä reittiä, jonka sisällä käytetään samaa modelia)
/* beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(testBlogs.manyBlogsList[0])
  await blogObject.save()

  blogObject = new Blog(testBlogs.manyBlogsList[1])
  await blogObject.save()
}) */

beforeEach(() => {
  return new Promise((resolve) => {
    Blog
      .deleteMany({})
      .then((result) => {
        logger.info('deleteMany done, result: ', result)
      })
    let blogObject = new Blog(testBlogs.manyBlogsList[0])
    blogObject
      .save()
      .then((result) => {
        logger.info('save done, result: ', result)
        resolve()
      })
  })
})

//* testeissä käytetään samoja kontrollereiden routeja kuin tuotantoversiossa
//* mutta koska tietokantayhteys on eri, niin routeilla haetaan tietoa testitietokannasta
//* Eli suoeragent-olio "api" käyttää tässä blogsRouteria .get-pyynnöllä, koska suluissa
//* annettu osoite vastaa app.js:ssä olevaa määrittelyä .use('/api/blogs', blogsRouter)
//* Reitti viittaa siis nyt testitietokannassa olevaan Blogs-kokoelmaan, koska yhteys
//* on avattu testitietokantaan


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

/* test('blogs are returned as json', () => {
  return api.get('/api/blogs').then(() => {
    expect(200)
    expect('Content-Type', /application\/json/)
  })
}) */

test('there is one blog', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(1)
})


/* test('there is one blog', () => {
  return api.get('/api/blogs').then((response) => {
    expect(response.body).toHaveLength(1)
  })
}) */

/* test('the first blog is about React patterns', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('React patterns')
}) */

afterAll(() => {
  mongoose.connection.close()
})