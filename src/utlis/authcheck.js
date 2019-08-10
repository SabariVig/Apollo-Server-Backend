const {AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')

module.exports = (authToken)=>
{
  authToken=authToken.headers.authorization
  if(!authToken) throw new AuthenticationError("Headers Not Found")

  try {
    const token =  jwt.verify(authToken,process.env.JWT_TOKEN)

    return token
    
  } catch (error) {
    throw new AuthenticationError("Token Invalid Or Expired")
  }

}