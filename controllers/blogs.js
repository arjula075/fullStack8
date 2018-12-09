// 31.07.2018

const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const Comment = require('../models/comment')
const utils = require('../utils/utils')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    .populate('user')
    .populate('comments')
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    .populate('user')
    .populate('comments')
    if (blog) {
      response.json(Blog.format(blog))
    }
    else {
      response.status(404).json("NOT FOUND")
    }

})


blogsRouter.delete('/:id', async (request, response) => {
  try {
    validCall = utils.isValidCall(request)
    if (validCall.statuscode !== 200) {
      response.status(validCall.statuscode).json(validCall.status)
      return
    }
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === validCall.id) {
      await blog.remove()
      response.status(200).json("OK")
    }
    else {
      response.status(401).json("not ok to delete other's blogs")
    }


  }
  catch (e) {
    console.log(e)
    response.status(500).json('vituiks män')
  }

})

blogsRouter.post('/', async(request, response) => {
  try {
    validCall = utils.isValidCall(request)
    if (validCall.statuscode !== 200) {
      response.status(validCall.statuscode).json(validCall.status)
      return
    }
    // for 4.17, get the first user
    // for later periods
    request.body.user = validCall.id

    const blog = new Blog(request.body)
    if (typeof blog.likes == 'undefined') {
      blog.likes = 0
    }
    if (!blog.url || !blog.title) {
      response.status(400).json('INCOMPLETE DATA')
      return
    }
    else {
      const savedBlog = await blog.save()
      const userId = await User.findById(validCall.id)
      userId.blogs = userId.blogs.concat(savedBlog.id)
      await userId.save()
      response.status(201).json('CREATED')
    }
  }
  catch (err) {
    console.log(err);
    response.status(500).json('vituiks män')
  }
})

blogsRouter.post('/:id/comments', async(request, response) => {
  try {
    console.log('now in be router');
    validCall = utils.isValidCall(request)
    if (validCall.statuscode !== 200) {
      response.status(validCall.statuscode).json(validCall.status)
      return
    }
    console.log('valid call', validCall);
    // for 4.17, get the first user
    // for later periods
    request.body.user = validCall.id

    const comment = new Comment(request.body)
    console.log('comment', comment);
    const savedComment = await comment.save()
    const blogId = await Blog.findById(request.params.id)
    console.log('blogId', blogId);
    blogId.comments = blogId.comments.concat(savedComment.id)
    await blogId.save()
    response.status(201).json('CREATED')


  }
  catch (err) {
    console.log(err);
    response.status(500).json('vituiks män')
  }
})


blogsRouter.put('/:id', async(request, response) => {
  validCall = utils.isValidCall(request)

  if (validCall.statuscode !== 200) {
    response.status(validCall.statuscode).json(validCall.status)
    return
  }

	const updatedBlog = request.body

  if (validateBlog(updatedBlog)) {
	   await Blog
	    .findByIdAndUpdate(request.params.id, updatedBlog, { new: true } )
      response.json(Blog.format(updatedBlog))
  }
  else {
    response.status(400).json('INCOMPLETE DATA')
  }

})

const validateBlog = (blog) => {

  if (!blog.title) {
    return false
  }
  if (!blog.author) {
    return false
  }
  if (!blog.url) {
    return false
  }
  if (!blog.title) {
    blog.title = 0;
    return true
  }
  return true
}

module.exports = blogsRouter
