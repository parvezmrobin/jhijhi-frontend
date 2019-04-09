/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


const { Schema } = require('mongoose');

module.exports = new Schema({
  name: String,
  shortName: String,
  players: [Schema.Types.ObjectId],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
