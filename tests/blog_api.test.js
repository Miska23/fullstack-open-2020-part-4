const mongoose = require('mongoose')
const Blog = require('../models/Blog')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app) //* nyt api-muuttujalla voi tehdä testejä

const testBlogs = require('../utils/testBlogs')
// const logger = require('../utils/logger')

//* alustus eli talletus ilman POSTIa. "npm test" avaa yhteyden testitietokantaan, jolloin
//* operaatioiden kutsuminen Blog-modelilla käyttää operaatioihin sitä Mongo-tietokantaa,
//* johon ollaan yhdistettynä (eli samaan tapaan kuin tuotantomoodissa kontrollereiden avulla mutta
//* ilman määrättyä reittiä, jonka sisällä käytetään samaa modelia)
beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(testBlogs.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(testBlogs.initialBlogs[1])
  await blogObject.save()
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

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(2)
})

test('the first blog is about React patterns', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body[0].title).toBe('React patterns')
})

//* 4.9
//TODO: kaikkien blogien testaaminen .id-ominaisuuden osalta
test('a blog should have an "id" property', async () => {
  const response = await api.get('/api/blogs')
  console.log('response.body: ', response.body)
  expect(response.body[0].id).toBeDefined()
})

//* 4.10
test('it is possible to create new blogs', async () => {
  const newBlog = testBlogs.miskanBlogi

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  console.log('titles: ', titles)

  expect(response.body).toHaveLength(testBlogs.initialBlogs.length + 1)
  expect(titles).toContain(
    'Fso-2020 rocks'
  )
})

//* 4.11: jos kentälle likes ei anneta arvoa, asetetaan sen arvoksi 0
//TODO: lisätyn muistiinpanon hakeminen dynaamisesti?
test('if blog is added without likes, likes will set to 0', async () => {
  const newBlog = testBlogs.blogiIlmanLikejä

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  expect(response.body[2].likes).toBe(0)
})

// TODO: 4.12 jo uusi blogi ei sisällä kenttiä title ja url, pyyntöön vastataan statuskoodilla 400 Bad request
/* test('if blog is added without title and url, status code of response will be 400', async () => {
  const newBlog = testBlogs.virheellinenBlogi

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})
 */

afterAll(async () => {
  await mongoose.connection.close()
})