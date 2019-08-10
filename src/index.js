const { ApolloServer,PubSub} = require("apollo-server");
const mongoose = require("mongoose");


const pubsub = new PubSub()
const typeDefs = require('./graphql/typedefs')
const resolvers = require('./graphql/resolvers')



mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log("Connected To DB 🧾")
);

const server = new ApolloServer({ typeDefs, resolvers ,context: ({req})=> ({req , pubsub})});

server.listen(8080, arg => console.log("Server Running 🚀"));
