const mongoose = require('mongoose');
const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLID, GraphQLNonNull } = graphql;
const SongType = require('./song_type');
const LyricType = require('./lyric_type');
const Lyric = mongoose.model('lyric');
const Song = mongoose.model('song');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',

  // all songs by using mongoose
  // () => ({}) to immediately self-invoked the promise async functions
  //   which are Song.find(), Song.findById(), and Lyric.findById()
  fields: () => ({
    songs: {
      type: new GraphQLList(SongType),
      resolve() {
        return Song.find({});
      }
    },
    song: {
      type: SongType,
      // ID required: true
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Song.findById(id);
      }
    },
    lyric: {
      type: LyricType,
      //ID required: true
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parnetValue, { id }) {
        return Lyric.findById(id);
      }
    }
  })
});

module.exports = RootQuery;