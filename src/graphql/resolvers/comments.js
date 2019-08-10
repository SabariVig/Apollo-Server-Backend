const Post = require('../../Models/Post')
const authcheck = require('../../utlis/authcheck')
const {AuthenticationError,UserInputError} = require('apollo-server')

module.exports={

  Mutation:{
    async createcomment(_,{postId,body},context){
      const {username} =authcheck(context.req)
      if(body.trim() === "") throw new UserInputError("Body Should Not Be Empty",{error:"Body Should Not Be Empty"})

      const post = await  Post.findById(postId)

      if(post)
      {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        })
        await post.save()
        return post
      }
      else
      { 
        throw new UserInputError("Post Not Found")
      }
      

    },
     deletecomment:async (_,{postId,commentId},context)=>{
      const {username} =authcheck(context.req)
      
      const post = await  Post.findById(postId)

      if(post){
        const commentIndex = post.comments.findIndex(c=> c.id === commentId)
    
        if(!post.comments[commentIndex]) throw new UserInputError("Comment Not Found")



        if(post.comments[commentIndex].username === username)
        {
          post.comments.splice(commentIndex,1)
          await post.save()
          return post
        }
        else throw new AuthenticationError("You Can Only Delete Your Comments")

      }
      else{
        throw new UserInputError("Post Not Found")
      }

     }   



  }

}