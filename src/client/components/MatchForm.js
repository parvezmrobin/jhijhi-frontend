/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component, Fragment} from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';


class MatchForm extends Component {
  teams;
  umpires;

  render() {
    return (
      <Fragment>
        <h2>Create Match</h2>
        <hr/>
        <form>
          <FormGroup name="name"/>
          <FormGroup name="team-1" type="select" options={this.props.teams}/>
          <FormGroup name="team-2" type="select" options={this.props.teams}/>
          <FormGroup name="umpire-1" type="select" options={this.props.umpires}/>
          <FormGroup name="umpire-2" type="select" options={this.props.umpires}/>
          <FormGroup name="umpire-3" type="select" options={this.props.umpires}/>
          <FormGroup name="overs" type="number"/>
          <FormButton type="submit" text="Create" btnClass="outline-success">
            {this.props.children}
          </FormButton>
        </form>
      </Fragment>
    );
  }

}

export default MatchForm;
