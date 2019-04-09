/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


const {Schema} = require('mongoose');

module.exports = new Schema({
  name: String,
  shortName: String,
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
