const testBlogs = require('../utils/testBlogs')
const listHelper = require('../utils/list_helper')

describe('Tests by Miska:', () => {
  test('dummy test returns one', () => {
    const result = listHelper.dummy(testBlogs.manyBlogsList)
    expect(result).toBe(1)
  })
  describe('Total likes :', () => {
    test('of empty list is zero', () => {
      const result = listHelper.totalLikes([])
      expect(result).toBe(0)
    })
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(testBlogs.oneBlogList)
      expect(result).toBe(testBlogs.oneBlogList[0].likes)
    })
    test('sums the likes of all blogs', () => {
      const result = listHelper.totalLikes(testBlogs.manyBlogsList)
      const allLikes = (blogs) => {
        return blogs.reduce((accumulator, blog) => {
          return accumulator + blog.likes
        }, 0)
      }
      expect(result).toBe(allLikes(testBlogs.manyBlogsList))
    })
  })
})
