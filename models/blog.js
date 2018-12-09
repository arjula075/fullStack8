// 31.07.2018

const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
	author: String,
	url: String,
	likes: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
})

 blogSchema.statics.format = function(blog) {
    const obj =  {
    id: blog._id,
		title: blog.title,
		author: blog.author,
		url: blog.url,
		likes: blog.likes,
    user: blog.user,
    comments: blog.comments
	}
	return obj
};

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
