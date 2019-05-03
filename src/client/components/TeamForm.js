/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component, Fragment} from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';


class TeamForm extends Component {
  players;

  render() {
    return (
      <Fragment>
        <h2>Create Team</h2>
        <hr/>
        <form onSubmit={(e) => {e.preventDefault(); this.props.onSubmit(e)}}>
          <FormGroup name="name" value={this.props.team.name}
                     onChange={(e) => this.props.onChange({name: e.target.value})}
                     isValid={this.props.isValid.name}
                     feedback={this.props.feedback.name}/>
          <FormGroup name="short-name" value={this.props.team.shortName}
                     onChange={(e) => this.props.onChange({shortName: e.target.value})}
                     isValid={this.props.isValid.shortName}
                     feedback={this.props.feedback.shortName}/>

          <FormButton type="submit" text="Create" btnClass="outline-success"/>
        </form>
      </Fragment>
    );
  }

}

export default TeamForm;
