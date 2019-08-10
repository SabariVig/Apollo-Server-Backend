const Post = require("../../Models/Post");
const checkAuth = require("../../utlis/authcheck");
const { AuthenticationError, UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    async getPosts() {
      try {
        return Post.find().sort({ createdAt: -1 });
      } catch (err) {
        return err;
      }
    },

    async getPost(_, { id }) {
      try {
        const post = await Post.findById(id);
        return post;
      } catch (err) {
        throw new Error("Post Not Found");
      }
    }
  },

  Mutation: {
    async createpost(_, { body }, context) {
      const user = checkAuth(context.req);
      const newpost = new Post({
        body,
        createdAt: new Date().toISOString(),
        user: user.id,
        username: user.username
      });

      const post = await newpost.save();

      context.pubsub.publish('NEW_POST',{newPost:post})

      return post;


    },

    async deletepost(_, { id }, context) {
      const user = checkAuth(context.req);

      try {
        const post = await Post.findById(id);

        if (user.username === post.username) {
          await post.delete();
          return "Succesfully Deleted";
        } else {
          throw new AuthenticationError("Not Authorized");
        }
      } catch (err) {
        throw new Error("Post Not Found");
      }
    },

    likepost: async (_, { postId }, context) => {
      const { username } = checkAuth(context.req);

      const post = await Post.findById(postId);

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          //Like  Already Exist ,Not Remove The Like
          post.likes = post.likes.filter(likes => likes.username !== username);
        } else {
          //Like Does Not Exist , Give It A like  👍
          post.likes.push({ username, createdAt: new Date().toISOString() });
        }
        await post.save();
        return post;
      } else throw new UserInputError("Post Not Found");
    }
  },

  Subscription:{
    newPost:{
      
      subscribe:(_,__,{pubsub}) => pubsub.asyncIterator('NEW_POST')
    
    }
  }


};
