/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React from 'react';
import ScoreInputV2 from './ScoreInputV2';
import * as PropTypes from 'prop-types';

function ScoreEdit(props) {
  const propsToBePassed = {
    batsmen: props.battingTeamPlayers,
    batsmanIndices: props.batsmanIndices,
    matchId: props.matchId,
    injectBowlEvent: (bowl) => {
      // `props.battingTeamPlayers` is the array of current battingTeamPlayers
      // hence for edit mode, calculation of `playedBy` is always incorrect
      delete bowl.playedBy;

      return {
        bowl,
        overNo: props.overNo,
        bowlNo: props.bowlNo,
      };
    },
    httpVerb: 'put',
    shouldResetAfterInput: true,
    actionText: 'Edit',
    onInput: bowlEvent => props.onInput(bowlEvent.bowl || bowlEvent),
  };
  return <ScoreInputV2 {...propsToBePassed}/>;
}

ScoreEdit.propTypes = {
  battingTeamPlayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreEdit;
