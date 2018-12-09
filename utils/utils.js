
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {

  try {
    const authorization = request.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }
  catch (e)  {
    console.log(e)
  }
}

const isValidCall = (request) => {
  try {
     const body = request.body
     const token = getTokenFrom(request)
     let decodedToken = undefined
     if (token) {
        decodedToken = jwt.verify(token, process.env.SECRET)
      }


      if (!token || !decodedToken.id) {
        return {'statuscode': 401, 'status':  'token missing or invalid' }
      }

      if (body === undefined) {
        return {'statuscode': 400, 'status':  'content missing' }
      }
      else {
        return {'statuscode': 200, 'status':  'OK', 'id':  decodedToken.id}
      }
 }
 catch (e)  {
   console.log(e)
   return  {'statuscode': 500, 'status': 'epicFail'}
 }

}

module.exports = {
  isValidCall,
}
