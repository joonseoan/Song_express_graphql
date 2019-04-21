const _ = require('lodash');
const graphql = require('graphql');
const { GraphQLSchema } = graphql;

const RootQueryType = require('./root_query_type');
const mutations = require('./mutations');

// GraphQL Schema with query and mutations
module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: mutations
});
