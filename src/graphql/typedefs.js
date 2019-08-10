const {gql} = require('apollo-server')

module.exports= gql`
  type Post 
  {
    body: String!
    id: ID!
    username: String!
    createdAt: String!
    comments:[Comment]!
    likes:[Like]!  
    likeCount:Int!
    commentCount:Int!
  }

  type Comment
  {
    id:ID!
    body:String!
    username:String!
    createdAt:String!

  }

  type Like
  {
    id:ID!
    createdAt:String!
    username:String!
  }

  type User
  {
    id:ID!
    username:String!,
    email:String!,
    token:String!,
    createdAt:String!

  }

  type Query
   {
    getPosts: [Post]
    getPost(id:ID!):Post!
  }

  input RegisterInput
  {
    username:String!
    email:String!,
    password:String!
    confirmPassword:String!,

  }


  type Mutation{
    register(registerInput:RegisterInput):User!
    login(username:String!,password:String!):User!
    createpost(body:String):Post!
    deletepost(id:ID!):String!
    createcomment(postId:ID!,username:String,body:String!):Post!
    deletecomment(postId:ID!,commentId:ID!):Post!
    likepost(postId:ID!):Post!
  }

  type Subscription{
    newPost:Post!
  }




`;

