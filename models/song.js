const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// setup mongoose schema
const SongSchema = new Schema({
  title: { type: String },
  lyrics: [{
    // reference id of lyric model
    type: Schema.Types.ObjectId,
    // model name
    ref: 'lyric'
  }]
});

// setup helper functions
// static fuctions of addLyric
SongSchema.statics.addLyric = async function(id, content) {

  // Invoke current lyric's mongo collection
  const Lyric = mongoose.model('lyric');

  // this: Song class of mongoose.model
  const Song = this;
  
  // find a specific with song id
  const song = await Song.findById(id);
    
  // create lyric instance containing cotent and song id to be saved in db
  // lyric has ref : Schema.Type.ObjectId
  const lyric = new Lyric({ content, song });

  // song enters lyric's id into the lyrics field which is an array 
  song.lyrics.push(lyric);

  // [lyric.save(), song.save()] : a callback which will be invoked to run the first and the second elements
  //   sequently in an array when it is "resolve"
  return Promise.all([ lyric.save(), song.save() ])
  
    // callback that returns song only 
    .then(([lyric, song]) => song);
}

// static helper function
SongSchema.statics.findLyrics = async function(id) {

  const Song = this;
  
  // populate all data in each lyric in the array
  // exec(): dealing with mongoose promise 
  const song = await Song.findById(id).populate('lyrics').exec();
  
  // return lyrics array
  return song.lyrics;

}

mongoose.model('song', SongSchema);