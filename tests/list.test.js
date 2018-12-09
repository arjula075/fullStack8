const listHelper = require('../utils/list_helper')
const config = require('../utils/config')
const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

describe('list helpers', () => {
	describe('initial test', () =>{
		test('dummy is called', () => {


		const result = listHelper.dummy(blogs)
		expect(result).toBe(1)
		})
	})

	describe('testing number of likes', () =>{
		// 4.4
		test('undefined list', () => {
			const result = listHelper.numberOfLikes()
			expect(result).toBe(0)
		})

		test('non list', () => {
			const result = listHelper.numberOfLikes('Hello world')
			expect(result).toBe(0)
		})
		test('empty list', () => {
			const result = listHelper.numberOfLikes('Hello world')
			expect(result).toBe(0)
		})

		test('correct list', () => {
			const result = listHelper.numberOfLikes(blogs)
			expect(result).toBe(36)
		})
	})

	describe('testing finding favourite blog', () =>{
		// 4.5
		test('undefined list', () => {
			const result = listHelper.favoriteBlog()
			expect(result).toBe(undefined)
		})

		test('non list', () => {
			const result = listHelper.favoriteBlog('Hello world')
			expect(result).toBe(undefined)
		})
		test('empty list', () => {
			const result = listHelper.favoriteBlog('Hello world')
			expect(result).toBe(undefined)
		})

		test('correct list', () => {
			const result = listHelper.favoriteBlog(blogs)
			// why on earth would I be comparing whole object
			// when I have identification at my disposal
			expect(result._id).toEqual('5a422b3a1b54a676234d17f9')
		})
	})

	describe('testing finding most productive author', () =>{
		// 4.6
		test('undefined list', () => {
			const result = listHelper.mostBlogs()
			expect(result).toBe(undefined)
		})

		test('non list', () => {
			const result = listHelper.mostBlogs('Hello world')
			expect(result).toBe(undefined)
		})
		test('empty list', () => {
			const result = listHelper.mostBlogs('Hello world')
			expect(result).toBe(undefined)
		})

		test('correct author', () => {
			const result = listHelper.mostBlogs(blogs)
			const expectedResult = { author: 'Robert C. Martin', blogs: 3 }
			expect(result.author).toEqual(expectedResult.author)
		})
		test('correct number', () => {
			const result = listHelper.mostBlogs(blogs)
			const expectedResult = { author: 'Robert C. Martin', blogs: 3 }
			expect(result.blogs).toEqual(expectedResult.blogs)
		})
	})

	describe('testing finding most lovable author', () =>{
		// 4.7
		test('correct author', () => {
			const result = listHelper.mostLikes(blogs)
			const expectedResult = { author: 'Edsger W. Dijkstra', likes: 17 }
			expect(result.author).toEqual(expectedResult.author)
		})
		test('correct number', () => {
			const result = listHelper.mostLikes(blogs)
			const expectedResult = { author: 'Edsger W. Dijkstra', likes: 17 }
			expect(result.likes).toEqual(expectedResult.likes)
		})
	})
})
