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
      const allLikes = 34
      expect(result).toBe(allLikes)
    })
  })
  describe('The blog with most likes :', () => {
    test('has the most likes', () => {
      const result = listHelper.favoriteBlog(testBlogs.manyBlogsList)
      const mostLikedBlog = testBlogs.manyBlogsList[3]
      expect(result).toEqual(mostLikedBlog)
    })
  })
  describe('The blogger with most :', () => {
    test('blogs', () => {
      const result = listHelper.mostBlogs(testBlogs.manyBlogsList)
      const mostBlogs = { author: 'Edsger W. Dijkstra', blogs: 2 }
      expect(result).toEqual(mostBlogs)
    })
    test('likes', () => {
      const result = listHelper.mostLikes(testBlogs.manyBlogsList)
      const mostLikes = { author: 'Edsger W. Dijkstra', likes: 17 }
      expect(result).toEqual(mostLikes)
    })
  })
})

