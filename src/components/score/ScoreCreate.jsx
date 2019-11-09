/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import ScoreInput from './ScoreInput';
import ScoreInputV2 from './ScoreInputV2';
import { CustomInput } from "reactstrap";

class ScoreCreate extends Component {
  state = {
    useV2: true,
  };

  render() {
    const propsToBePassed = {
      ...this.props,
      injectBowlEvent: el => el,
      defaultHttpVerb: 'post',
      shouldResetAfterInput: true,
      actionText: 'Insert',
    };

    propsToBePassed[(this.state.useV2 ? 'httpVerb' : 'defaultHttpVerb')] = 'post';
    const Component = this.state.useV2 ? ScoreInputV2 : ScoreInput;
    return <div className="container-fluid px-0">
      <div className="text-white lead">
        <label className={this.state.useV2 ? 'badge' : 'badge badge-primary'}>Pro Scoring</label>
        <CustomInput className="mx-2 pt-2 justify-content-end" checked={this.state.useV2}
                     type="switch" id="innings" name="innings" inline
                     onChange={e => this.setState({ useV2: e.target.checked })}/>
        <label className={!this.state.useV2 ? 'badge' : 'badge badge-primary'}>Convenient Scoring</label>
      </div>
      <Component {...propsToBePassed}/>
    </div>;
  }
}

ScoreCreate.propTypes = {
  batsmen: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  onInput: PropTypes.func.isRequired,
};

export default ScoreCreate;
