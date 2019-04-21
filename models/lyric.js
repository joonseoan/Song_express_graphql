const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// lyric Schema
const LyricSchema = new Schema({
  
  // ref for ObjectId of song
  song: {
    type: Schema.Types.ObjectId,
    ref: 'song' // must same id as 'song' model's id
  },
  likes: { type: Number, default: 0 },
  content: { type: String }
});

// Due to definition of song's 'ref', 
//  must use the parameter of 'song' model's id
// static functions of lyric schema
LyricSchema.statics.like = async function(id) {
  
  // Invoke lyric's mongo Collection
  const Lyric = mongoose.model('lyric');

  // find the lyric
  const lyric = await Lyric.findById(id);
  
  // whenever the client request, it does plus 1
  lyric.likes = lyric.likes + 1;

  // then save the current value
  return await lyric.save();

}

mongoose.model('lyric', LyricSchema);