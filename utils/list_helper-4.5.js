
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

const compareBlogs = (favouriteBlog, blog) => {
	

	const oldFav = favouriteBlog.likes
	if (!oldFav) {
		return blog
	}
	const challenger = blog.likes
	console.log(oldFav, challenger)
	if (challenger > oldFav) {
		return blog
	}
	else {
		return favouriteBlog
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
  dummy, numberOfLikes, favoriteBlog
}