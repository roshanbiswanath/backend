const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolver');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = 'mongodb+srv://khand8914:QFRKmhV9QyWUlw19@cluster0.w4xp7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const SECRET_KEY = 'key';

// Middleware for authentication
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, SECRET_KEY);
    } catch (e) {
      console.log('Invalid Token');
    }
  }
  next();
});

// Start Apollo Server
// Start Apollo Server
async function startServer() {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ user: req.user }),
    });
    await server.start();
    server.applyMiddleware({ app });
  
    // Connect to MongoDB and start the server
    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        app.listen(PORT, () => {
          console.log(`Server running on http://localhost:${PORT}${server.graphqlPath}`);
        });
      })
      .catch(err => console.error(err));
  }
  
  startServer();


