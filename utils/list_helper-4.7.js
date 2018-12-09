
const dummy = (blogs) => {
  return 1
}

const numberOfLikes = (blogs) => {
	// ok, so basically these other cases should return something else than zero
	// but I am lazy
	
	// and refactoring it in 4.5
	if (validateBlogs(blogs)) {
			return blogs.reduce((sum, blog) => sum + blog.likes, 0)
	}
	else {
		return 0
	}
}

const favoriteBlog = (blogs) => {
	if (validateBlogs(blogs)) {
			return blogs.reduce((favouriteBlog, blog) => compareBlogs(favouriteBlog, blog), new Object())
	}
	else {
		return
	}
	
}

const mostBlogs  = (blogs) => {
	
	if (validateBlogs(blogs)) {
			const writers = blogs.reduce((writerArray, blog) => createWriterArray(writerArray, blog), [])
			console.log('writers', writers)
			if (validateBlogs(writers)) {
				return writers.reduce((productiveWriter, writer) => compareAuthors(productiveWriter, writer), new Object())
			}
			else {
				return
			}
	}
	else {
		return
	}
	
}

const mostLikes = (blogs) => {
		if (validateBlogs(blogs)) {
			const writers = blogs.reduce((writerArray, blog) => createWriterArray(writerArray, blog), [])
			console.log('writers', writers)
			if (validateBlogs(writers)) {
				return writers.reduce((productiveWriter, writer) => compareAuthorsByLikes(productiveWriter, writer), new Object())
			}
			else {
				return
			}
	}
	else {
		return
	}
	
}

const createWriterArray = (writerArray, blog) => {
	
	if (typeof writerArray == 'undefined') {
		writerArray = []
	}

	const writer = writerArray.findIndex((writer) => writer.author === blog.author)
	if (typeof writer == 'undefined' || writer < 0) {
		newWriter = {
			author : blog.author,
			blogs : 1,
			likes: blog.likes
		}
		writerArray.push(newWriter)
	}
	else {
		writerArray[writer].likes = writerArray[writer].likes + blog.likes
		writerArray[writer].blogs = writerArray[writer].blogs + 1
	}
	return writerArray
	
}

const compareBlogs = (favouriteBlog, blog) => {
	
	const oldFav = favouriteBlog.likes
	if (!oldFav) {
		return blog
	}
	const challenger = blog.likes
	if (challenger > oldFav) {
		return blog
	}
	else {
		return favouriteBlog
	}
}

const compareAuthors = (productiveWriter, writer) => {
	
	const oldFav = productiveWriter.blogs
	if (!oldFav) {
		return writer
	}
	const challenger = writer.blogs
	if (challenger > oldFav) {
		return writer
	}
	else {
		return productiveWriter
	}
}

const compareAuthorsByLikes = (productiveWriter, writer) => {
	
	const oldFav = productiveWriter.likes
	if (!oldFav) {
		return writer
	}
	const challenger = writer.likes
	if (challenger > oldFav) {
		return writer
	}
	else {
		return productiveWriter
	}
}

const validateBlogs = (blogs) => {
	
	if (blogs) {
		if (Array.isArray(blogs)) {
			if (blogs.length > 0) {
				return true
			}
			else {
				return false
			}
		}
		else {
			return false
		}
	}
	else {
		return false
	}
	
}

module.exports = {
  dummy, numberOfLikes, favoriteBlog, mostBlogs, mostLikes
}