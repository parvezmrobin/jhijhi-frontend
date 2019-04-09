/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component, Fragment} from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import CheckBoxControl from "./form/control/checkbox";
import {toTitleCase} from "../lib/utils";


class TeamForm extends Component {
  players;

  render() {
    const getCheckboxOnChange = (i) => {
      return (e) => this.props.onChange({[e.target.checked ? 'select' : 'unselect']: i});
    };
// if checkbox is checked, key is 'select' and 'unselect otherwise. value is the index
    const mapper = (player, i) => {
      return (
        <CheckBoxControl name={`cb-${player.jerseyNo}`} onChange={getCheckboxOnChange(i)}>
          {toTitleCase(player.name)}
        </CheckBoxControl>
      );
    };
    const listItems = this.props.players.map(
      (player, i) => {
        return (<li key={player._id} className="list-group-item bg-transparent flex-fill">{mapper(player, i)}</li>);
      },
    );
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

          <div className="form-group row">
            <label className="col-form-label col-md-4 col-lg-3">
              Choose Players
            </label>
            <div className="col">
              <ul className="list-group-select">{listItems}</ul>
            </div>
          </div>
          <FormButton type="submit" text="Create" btnClass="outline-success">
            {this.props.children}
          </FormButton>
        </form>
      </Fragment>
    );
  }

}

export default TeamForm;
