const graphql = require('graphql');

// setup scalar types
const { GraphQLObjectType, GraphQLString, GraphQLID } = graphql;
const mongoose = require('mongoose');

// registered mongoose classes
const Song = mongoose.model('song');
const Lyric = mongoose.model('lyric');

// imports all types to mutate and return value
const SongType = require('./song_type');
const LyricType = require('./lyric_type');

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addSong: {

      // return type
      type: SongType,
      // variables
      args: {
        title: { type: GraphQLString }
      },
      
      // reuturn new song instance which is saved in db
      resolve(parentValue, { title }) {
        // to immediatley create the instance and then save it mogodb
        // self-invoked, saved, and create instance for the client
        return (new Song({ title })).save();
      }
    },

    addLyricToSong: {
      
      // return type
      type: SongType,

      // variables
      args: {
        content: { type: GraphQLString },
        songId: { type: GraphQLID }
      },

      // return value by using static method fo Song mongoose schema
      resolve(parentValue, { content, songId }) {
        return Song.addLyric(songId, content);
      }
    },
    
    likeLyric: {

      // return type
      type: LyricType,
      
      // variables
      args: { id: { type: GraphQLID } },

      // return value by using static method of Lyric Schema
      resolve(parentValue, { id }) {
        return Lyric.like(id);
      }
    },

    deleteSong: {

      // return type
      type: SongType,

      // variables
      args: { id: { type: GraphQLID } },

      // return value by using static method of Song schema
      resolve(parentValue, { id }) {
        return Song.deleteOne({ _id: id });
      }
    }
  }
});

module.exports = mutation;