/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


const {Schema} = require('mongoose');

const inningsSchema = new Schema({
  overs: {
    bowledBy: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    bowls: [{
      playedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Player',
      },
      isWicket: String,
      singles: {
        type: Number,
        default: 0,
      },
      by: {
        type: Number,
        default: 0,
      },
      legBy: {
        type: Number,
        default: 0,
      },
      boundary: {
        run: Number,
        kind: {
          type: String,
          enum: ['regular', 'by', 'legBy'],
        },
      },
      isWide: Boolean,
      isNo: String, // containing the reason of no
    }],
  },
});

module.exports = new Schema({
  name: String,
  team1: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  team2: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  team1WonToss: Boolean,
  team1BatFirst: Boolean,
  umpire1: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Umpire',
  },
  umpire2: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Umpire',
  },
  umpire3: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'Umpire',
  },
  team1Players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  team2Players: [{
    type: Schema.Types.ObjectId,
    ref: 'Player',
  }],
  team1Captain: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  team2Captain: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  innings1: {
    type: inningsSchema,
    default: null,
  },
  innings2: {
    type: inningsSchema,
    default: null,
  },
});
