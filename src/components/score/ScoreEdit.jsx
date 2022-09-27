/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */

import React from 'react';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import ScoreInputV2 from './ScoreInputV2';
import { PlayerType } from '../../types';

function ScoreEdit(props) {
  const {
    battingTeamPlayers,
    batsmanIndices,
    matchId,
    overNo,
    bowlNo,
    onInput,
  } = props;
  const injectBowlEvent = (bowl) => {
    // `props.battingTeamPlayers` is the array of current battingTeamPlayers
    // hence for edit mode, calculation of `playedBy` is almost always incorrect
    delete bowl.playedBy; // eslint-disable-line no-param-reassign

    return {
      ...bowl,
      overNo,
      bowlNo,
    };
  };

  return (
    <ScoreInputV2
      batsmen={battingTeamPlayers}
      batsmanIndices={batsmanIndices}
      matchId={matchId}
      injectBowlEvent={injectBowlEvent}
      httpVerb="put"
      shouldResetAfterInput
      actionText="Edit"
      onInput={(bowlEvent) => onInput(bowlEvent.bowl || bowlEvent)}
    />
  );
}

ScoreEdit.propTypes = {
  battingTeamPlayers: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreEdit;
