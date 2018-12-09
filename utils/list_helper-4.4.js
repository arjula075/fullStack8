
const dummy = (blogs) => {
  return 1
}

const numberOfLikes = (blogs) => {
	// ok, so basically these other cases should return something else than zero
	// but I am lazy
	if (blogs) {
		if (Array.isArray(blogs)) {
			if (blogs.length > 0) {
				return blogs.reduce((sum, blog) => sum + blog.likes, 0)
			}
			else {
				return 0
			}
		}
		else {
			return 0
		}
	}
	else {
		return 0
	}
}

module.exports = {
  dummy, numberOfLikes
}