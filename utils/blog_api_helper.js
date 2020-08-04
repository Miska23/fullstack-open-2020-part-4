const Blog = require('../models/Blog')

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
const blogToSaveSuccessfully =
  { title: 'Fso-2020 rocks',
    author: 'Miska Linden',
    url: 'https://miskalinden.com/',
    likes: 7,
  }

const blogWithoutLikes =
  { title: 'C++ is difficult',
    author: 'Pekka Pekkanen',
    url: 'https://pekkanen.com/'
  }

const invalidBlog =
  {
    url: 'https://virheURL.com/',
    likes: 10
  }


const blogsInDatabase = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}


//* tarkista jokainen element sen varalta että property ei ole undefined
//* funktio palauttaa true vain jos kaikkien elementtien property ei ole undefined
const isPropertyOfEveryElementNotUndefined = function(array, property) {
  return array.every(element => typeof(element[property]) !== 'undefined')
}

module.exports = {
  initialBlogs,
  blogToSaveSuccessfully,
  blogWithoutLikes,
  invalidBlog,
  blogsInDatabase,
  isPropertyOfEveryElementNotUndefined
}