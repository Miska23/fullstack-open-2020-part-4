const initialBlogs = [
  { title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  { title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
/*   { _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  { _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  } */
]
const miskanBlogi =
  { title: 'Fso-2020 rocks',
    author: 'Miska Linden',
    url: 'https://miskalinden.com/',
    likes: 7,
  }

const blogiIlmanLikejä =
  { title: 'C++ is difficult',
    author: 'Miska Linden',
    url: 'https://miskalinden.com/'
  }

const virheellinenBlogi =
  {
    url: 'https://miskalinden.com/',
    likes: 10
  }

module.exports = {
  initialBlogs,
  miskanBlogi,
  blogiIlmanLikejä,
  virheellinenBlogi
}