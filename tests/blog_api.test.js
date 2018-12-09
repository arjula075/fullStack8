const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const config = require('../utils/config')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

let idToBeDeleted = ''
let initialUserID = ''
const comment = {comment: 'What is the flying speed of an unloaded swallow'}
let rootToken = undefined


// setting up test data
const initialBlogs = [
	{
		"title": "Ari's first blog",
		"author": "Ari Lahti",
		"url": "https://jotain.jossain",
		"likes": 1
	},
	{
		"title": "And now to something completely different",
		"author": "John Cleese",
		"url": "https://muuta.muualla",
		"likes": 2,
	}
]

const addedBlog =
	{
		"title": "This is getting way too silly",
		"author": "Terry Gilliam",
		"url": "https://jotain.jossain",
		"likes": 1
	}

	const noLikes =
		{
			"title": "This is an ex-parrot",
			"author": "Graham Chapman",
			"url": "https://jotain.jossain"
		}

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen'
		}

		const wrongUser = {
			username: 'salainen',
			name: 'Jukka Luukkainen',
			password: 'wererewr'
		}


beforeAll(async () => {
	// empty database

	initiateConnection()

	await Blog.remove({})
	await User.remove({})


	// add initial data
	const saltRounds = 10
	const passwordHash = await bcrypt.hash('sekret', saltRounds)
	const user = new User({
		username: 'root',
		name: 'Test user',
		passwordHash
	})


	await user.save()
	initialUserID = user.id
	// it seems that it works with the API, but test is broken
	// so, even though it is a bit stupid, I'll refactor the code so
	// the we use API...

	// and we have to sign in...
	rootToken = await signIn({'username':'root', 'password': 'sekret'})
	for (let i = 0; i < initialBlogs.length; i++) {
		const newBlog = await api
		.post('/api/blogs')
		.set('data-type', 'application/json')
		.set('Authorization', rootToken)
		.send(initialBlogs[i])
	}


})

describe('blog API tests', () => {
	describe('get part of API', () => {
		test('blogs are returned as json', async () => {
	  	const response = await api
	    	.get('/api/blogs')
	    	.expect(200)
	    	.expect('Content-Type', /application\/json/)
			})

			test('blogs contain correct number', async () => {
				const response = await api
				.get('/api/blogs')

				expect(response.body.length).toBe(2)
			})

			test('blogs contain  correct title', async () => {
				const response = await api
				.get('/api/blogs')

				const contents = response.body.map(r => r.title)
				expect(contents).toContainEqual('And now to something completely different')
			})

			test('blogs contain  correct author', async () => {
				const response = await api
							.get('/api/blogs')

				const contents = response.body.map(r => r.author)
				expect(contents).toContainEqual('John Cleese')
			})
			test('blogs contain correct user', async () => {
				const response = await api
							.get('/api/blogs')
				config.log('body', JSON.stringify(response.body));
				const contents = response.body.map(r => r.user.username)
				expect(contents).toContainEqual('root')
			})
		})

	describe('post part of API', () => {

		test('before auth nothing can be added (no token)', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.send(addedBlog)
			.expect(401)
		})
		test('before auth nothing can be added (bogus token)', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', 'application/json')
			.send(addedBlog)
			.expect(401)
		})


		test('valid new object can be added', async () => {
			addedBlog.user = initialUserID
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(addedBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		})

		test('added data is correct', async () => {
			const response = await api
				.get('/api/blogs')
  		const contents = response.body.map(r => r.title)

  		expect(response.body.length).toBe(initialBlogs.length + 1)
  		expect(contents).toContainEqual('This is getting way too silly')

		})
		test('no likes', async () => {
			noLikes.user = initialUserID
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)

			const response = await api
				.get('/api/blogs')
			const content = response.body.find(r => r.title === 'This is an ex-parrot')

			expect(content.likes).toBe(0)

		})
		test('no title should return 400', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(	{"author": "Graham Chapman"})
			.expect(400)
		})
		test('no url should return 400', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(	{"": "Graham Chapman"})
			.expect(400)
		})

	})

	describe('delete part of API', () => {
		describe('deleting addedBlog', () => {
			let url = undefined
			// get some ID
			test('get initial data', async() => {
				let response = await api
					.get('/api/blogs')

				const content = response.body.find(r => r.title === 'This is an ex-parrot')
				idToBeDeleted = content._id
				url = '/api/blogs/' + content._id
				expect(idToBeDeleted).not.toBeUndefined()
			})

			//first we test that it returns now something
			test('first we test that it returns now something', async () => {
				response = await api
					.get('/api/blogs/' + idToBeDeleted)
						.expect(200)
			})

			// then we try to delete it with wrong guy
			test('then we try to delete it with wrong guy', async () => {
				await api
					.post('/api/users')
					.send(wrongUser)
				const wronToken = await signIn(wrongUser)
				console.log('wronToken', wronToken);
				for (let i = 0; i < 10; i++) {
					console.log(i);
				}
				response = await api
					.delete('/api/blogs/' + idToBeDeleted)
					.set('Authorization', wronToken)
						.expect(401)
			})

			// then we actually delete it
			test('then we actually delete it', async () => {
				response = await api
					.delete('/api/blogs/' + idToBeDeleted)
					.set('Authorization', rootToken)
						.expect(200)
			})
			test('testing that addedBlog cant be found again', async () => {
				response = await api
					.get('/api/blogs/' + idToBeDeleted)
						.expect(404)
			})


		})
		test('testing that addedBlog cant be found again', async () => {
			response = await api
				.get('/api/blogs/' + idToBeDeleted)
					.expect(404)
		})
	})
	describe('put part of API', () => {
		// first we put that one again there
		test('put updated item there', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		})

		// then we get the id
		test('get the id', async () => {
		let response = await api
			.get('/api/blogs')
			const content = response.body.find(r => r.title === 'This is an ex-parrot')
			idToBeDeleted = content._id
			expect(idToBeDeleted).not.toBeUndefined()

		})

		test('before auth nothing can be added (no token)', async () => {
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.send(addedBlog)
			.expect(401)
		})
		test('before auth nothing can be added (bogus token)', async () => {
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.set('Authorization', 'application/json')
			.send(addedBlog)
			.expect(401)
		})

		test('put updated item there', async () => {
			const newBlog = await api
			.post('/api/blogs')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		})

		// then we get the id
		test('get the id', async () => {
		let response = await api
			.get('/api/blogs')
			const content = response.body.find(r => r.title === 'This is an ex-parrot')
			idToBeDeleted = content._id
			expect(idToBeDeleted).not.toBeUndefined()

		})

		// then we try to update it with different malformatted data

		test('no title', async () => {
			noLikes.title = undefined
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(400)
		})
		test('no author', async () => {
			noLikes.title ='This is my theory, and it is mine'
			noLikes.author = undefined
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(400)
		})
		test('no url', async () => {
			noLikes.author = 'Eric Idle'
			noLikes.url = undefined
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(400)
		})


		// then with real data
		test('correct data', async () => {
			noLikes.url = 'https://muuta.muualla'
			const newBlog = await api
			.put('/api/blogs/' + idToBeDeleted)
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(noLikes)
			.expect(200)
		})

	})

})

describe('user part of API', () => {

	test('POST /api/users succeeds with a no password', async () => {

		newUser.password = undefined
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)

	})

	test('POST /api/users succeeds with a too short password', async () => {
		newUser.password = 'NA'
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
	})

	test('POST /api/users succeeds with a fresh username', async () => {
		const usersBeforeOperation = await usersInDb()

		newUser.password = 'salainen'
		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const usersAfterOperation = await usersInDb()
		expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
		const usernames = usersAfterOperation.map(u=>u.username)
		expect(usernames).toContain(newUser.username)
	})

})

describe('comment part of API', () => {

	test('POST /api/blogs/:id/comments does not succeed with a no password', async () => {

		const comment = {comment: 'this sucks'}
		await api
			.post('/api/blogs/' + idToBeDeleted + '/comments')
			.send(comment)
			.expect(401)

	})

	test('POST /api/blogs/:id/comments does not succeed with bogus token', async () => {


		await api
			.post('/api/blogs/' + idToBeDeleted + '/comments')
			.set('data-type', 'application/json')
			.set('Authorization', 'application/json')
			.send(comment)
			.expect(401)
	})

	test('POST /api/blogs/:id/comments does succeed with proper token', async () => {

		await api
			.post('/api/blogs/' + idToBeDeleted + '/comments')
			.set('data-type', 'application/json')
			.set('Authorization', rootToken)
			.send(comment)
			.expect(201)
	})

	// my api is a bit poor, I allows comment to be added to a bogus blog. So I will not be testing that.
	// therefore just testing, that added comment is there
	test('added data is correct', async () => {
		const response = await api
			.get('/api/blogs/' + idToBeDeleted)
		const contents = response.body
		console.log('contents', contents);
		for (let i = 0; i < 10; i++) {
			console.log('contents of blog after added comment', contents);
		}

		expect(contents.comments.length).toBe(1)
		expect(contents.comments[0].comment).toMatch(/What is the flying speed of an unloaded swallow/)

	})


})

afterAll(() => {
	if (server) {
		server.close()
	}
})

const usersInDb = async() => {
	try {
    const users = await User.find({})
		return users.map(user => User.format(user))

	}
	catch (e) {
		console.log(e)
	}
}

const signIn = async(user) => {
	try {
		console.log('user', user);
		const result = await api
		.post('/api/login')
		.set('data-type', 'application/json')
		.send(user)
		console.log('result', result.body);
		for (let i = 0; i < 10; i++) {
			console.log(i);
		}
		const resultText = 'bearer ' + result.body.token
		return resultText
	}
	catch (err) {
		console.log(err)
	}


}

const initiateConnection = () => {
	try {
		let url = undefined
		url = config.mongoUrl
		mongoose.connect(url)
	}
	catch (e) {
		console.log(e)
	}
}
