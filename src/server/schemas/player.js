/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


const { Schema } = require('mongoose');

module.exports = new Schema({
  name: String,
  jerseyNo: {
    type: Number,
    min: 1,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});
