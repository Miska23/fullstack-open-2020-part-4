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