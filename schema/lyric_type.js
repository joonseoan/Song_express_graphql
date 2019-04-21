const mongoose = require('mongoose');
const graphql = require('graphql');

// GraphQL scalar types
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLInt,
  GraphQLString
} = graphql;

// Lyric Class of mongoose.model
const Lyric = mongoose.model('lyric');

// GraphQL's Constructor-based Schema
const LyricType = new GraphQLObjectType({

  // Schema key name assined to GraphQL
  name:  'LyricType',
  
  // LyricType field setup
  // () => ({}) to invoke the inner fuction 
  //  and then execute resolve(praentValue)'s promise callback
  fields: () => ({
    id: { type: GraphQLID },
    likes: { type: GraphQLInt },
    content: { type: GraphQLString },
    song: {
      // type: SongType defined in song_type.js
      type: require('./song_type'),
      
      // resolver 
      resolve(parentValue) {

        // find a lyric instance by using id information
        // populate all song data by using ref: Schema.Type.ObjectID
        Lyric.findById(parentValue.id).populate('song')
          .then(lyric => {
            // error handling
            if(!lyric) throw new Error('Unable to find lyric');

            // return value
            return lyric.song;
          })
          .catch(e => {
            throw new Error(e || 'Faile to get SongType.');
          });
      }
    }
  })
});

module.exports = LyricType;
