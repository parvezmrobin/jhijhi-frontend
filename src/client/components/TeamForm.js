/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component, Fragment} from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import CheckBoxControl from "./form/control/checkbox";


class TeamForm extends Component {
  players;

  render() {
    const mapper = (player) => <CheckBoxControl name={`cb-${player.shortName}`}>{player.name}</CheckBoxControl>;
    const listItems = this.props.players.map(
      (player, i) => {
        return (<li key={player._id} className="list-group-item bg-transparent flex-fill">{mapper(player, i)}</li>);
      },
    );
    return (
      <Fragment>
        <h2>Create Team</h2>
        <hr/>
        <form>
          <FormGroup name="name"/>
          <FormGroup name="short-name"/>
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
