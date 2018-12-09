// 31.07.2018

const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  comment: String,
  blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
})

 commentSchema.statics.format = function(comment) {
    const obj =  {
    id: comment._id,
		comment: comment.title,
    blog: comment.blog
	}
	return obj
};

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
