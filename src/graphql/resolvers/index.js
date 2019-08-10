const postResolvers= require('./post')
const userResolvers= require('./user')
const commentResolver = require('./comments')

module.exports={

  Post:{
    likeCount:(parent)=>parent.likes.length,
    commentCount:(parent)=>parent.comments.length 

  },

  Query:{
    ...postResolvers.Query
  },
  Mutation:{
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolver.Mutation,
    

  },
  Subscription:{
    ...postResolvers.Subscription
  }

}