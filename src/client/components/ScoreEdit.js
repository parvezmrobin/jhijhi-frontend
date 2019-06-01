/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React from 'react';
import ScoreInput from './ScoreInput';
import * as PropTypes from 'prop-types';

function ScoreEdit(props) {
  const propsToBePassed = {
    batsmen: props.batsmen,
    batsmanIndices: props.batsmanIndices,
    matchId: props.matchId,
    injectBowlEvent: el => ({...el, overNo: props.overNo, bowlNo: props.bowlNo}),
    defaultHttpVerb: 'post',
    shouldResetAfterInput: true,
    onInput: props.onInput,
  };
  return <ScoreInput {...propsToBePassed}/>;
}

ScoreEdit.propTypes = {
  batsmen: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreEdit;
