/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import { CustomInput } from 'reactstrap';
import ScoreInput from './ScoreInput';
import ScoreInputV2 from './ScoreInputV2';
import { Player as PlayerType } from '../../types';

class ScoreCreate extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      useV2: true,
    };
  }

  render() {
    const propsToBePassed = {
      ...this.props,
      injectBowlEvent: (el) => el,
      defaultHttpVerb: 'post',
      shouldResetAfterInput: true,
      actionText: 'Insert',
    };

    const { useV2 } = this.state;
    propsToBePassed[useV2 ? 'httpVerb' : 'defaultHttpVerb'] = 'post';
    const ScoreComponent = useV2 ? ScoreInputV2 : ScoreInput;
    return (
      <div className="container-fluid px-0">
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
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ScoreComponent {...propsToBePassed} />
      </div>
    );
  }
}

ScoreCreate.propTypes = {
  batsmen: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreCreate;
