// 31.07.2018

const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Blog = require('./models/blog')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')



app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
const config = require('./utils/config')

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.logger)


const PORT = config.port

morgan.token('payload', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :payload :status :response-time ms'))

const mongoose = require('mongoose')

const initiateConnection = () => {
	try {
		let url = undefined
		if ( process.env.NODE_ENV === 'production' ) {
			url = config.mongoUrl
			mongoose.connect(url)
		}
		else {
			url = config.mongoUrl
			mongoose.connect(url)
		}

	}
	catch (e) {
		console.log(e)
	}
}

initiateConnection()

const server = http.createServer(app)

server.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
	mongoose.connection.close()
})

module.exports = {
  app, server
}
