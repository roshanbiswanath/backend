const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type House {
    id: ID!
    title: String!
    description: String
    price: Float!
    location: String!
    houseType: String!
    images: [String!]!
    owner: User!
  }

  type Query {
    getHouses: [House!]
    getHouseById(houseId: ID!): House
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    addHouse(title: String!, description: String, price: Float!, location: String!, houseType: String!, images: [String!]!): House
  }
`;
