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
        <form onSubmit={(e) => {e.preventDefault(); this.props.onSubmit(e)}}>
          <FormGroup name="name" value={this.props.values.name}
                     onChange={(e) => this.props.onChange({name: e.target.value})}
                     isValid={this.props.isValid.name} feedback={this.props.feedback.name}/>
          <FormGroup name="team-1" type="select" options={this.props.teams} value={this.props.values.team1}
                     onChange={(e) => this.props.onChange({team1: e.target.value})}
                     isValid={this.props.isValid.team1} feedback={this.props.feedback.team1}/>
          <FormGroup name="team-2" type="select" options={this.props.teams} value={this.props.values.team2}
                     onChange={(e) => this.props.onChange({team2: e.target.value})}
                     isValid={this.props.isValid.team2} feedback={this.props.feedback.team2}/>
          <FormGroup name="umpire-1" type="select" options={this.props.umpires} value={this.props.values.umpire1}
                     onChange={(e) => this.props.onChange({umpire1: e.target.value})}
                     isValid={this.props.isValid.umpire1} feedback={this.props.feedback.umpire1}/>
          <FormGroup name="umpire-2" type="select" options={this.props.umpires} value={this.props.values.umpire2}
                     onChange={(e) => this.props.onChange({umpire2: e.target.value})}
                     isValid={this.props.isValid.umpire2} feedback={this.props.feedback.umpire2}/>
          <FormGroup name="umpire-3" type="select" options={this.props.umpires} value={this.props.values.umpire3}
                     onChange={(e) => this.props.onChange({umpire3: e.target.value})}
                     isValid={this.props.isValid.umpire3} feedback={this.props.feedback.umpire3}/>
          <FormGroup name="overs" type="number" value={this.props.values.overs}
                     onChange={(e) => this.props.onChange({overs: e.target.value})}
                     isValid={this.props.isValid.overs} feedback={this.props.feedback.overs}/>
          <FormButton type="submit" text="Create" btnClass="outline-success">
            {this.props.children}
          </FormButton>
        </form>
      </Fragment>
    );
  }

}

export default MatchForm;
