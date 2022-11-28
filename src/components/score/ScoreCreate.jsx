/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { number, shape } from 'prop-types';
import { CustomInput } from 'reactstrap';
import ScoreInput from './ScoreInput';
import ScoreInputV2 from './ScoreInputV2';
import { PlayerType } from '../../types';

class ScoreCreate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      useV2: true,
    };
  }

  render() {
    const { batsmen, batsmanIndices, matchId, onInput } = this.props;
    const injectBowlEvent = (el) => el;

    const { useV2 } = this.state;
    return (
      <div className="container-fluid px-0 sticky-top" style={{ top: '56px' }}>
        <div className="text-white lead">
          <label
            className={useV2 ? 'badge' : 'badge badge-primary'}
            htmlFor="innings"
          >
            Pro Scoring
          </label>
          <CustomInput
            className="mx-2 pt-2 justify-content-end"
            checked={useV2}
            type="switch"
            id="innings"
            name="innings"
            inline
            onChange={(e) => this.setState({ useV2: e.target.checked })}
          />
          <label
            className={!useV2 ? 'badge' : 'badge badge-primary'}
            htmlFor="innings"
          >
            Convenient Scoring
          </label>
        </div>
        {useV2 ? (
          <ScoreInputV2
            batsmen={batsmen}
            batsmanIndices={batsmanIndices}
            matchId={matchId}
            onInput={onInput}
            injectBowlEvent={injectBowlEvent}
            shouldResetAfterInput
            actionText="Insert"
            httpVerb="post"
          />
        ) : (
          <ScoreInput
            batsmen={batsmen}
            batsmanIndices={batsmanIndices}
            matchId={matchId}
            onInput={onInput}
            defaultHttpVerb="post"
            injectBowlEvent={injectBowlEvent}
            shouldResetAfterInput
          />
        )}
      </div>
    );
  }
}

ScoreCreate.propTypes = {
  batsmen: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  batsmanIndices: PropTypes.arrayOf(number).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreCreate;
