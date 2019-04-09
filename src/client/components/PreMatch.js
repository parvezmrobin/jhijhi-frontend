/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 09, 2019
 */


import React, {Component} from "react";
import CenterContent from "./layouts/CenterContent";
import CheckBoxControl from "./form/control/checkbox";
import {bindMethods, subtract, toTitleCase} from "../lib/utils";
import FormGroup from "./form/FormGroup";
import FormButton from "./form/FormButton";
import fetcher from "../lib/fetcher";

export default class PreMatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      team1Players: [],
      team2Players: [],
      team1Captain: '',
      team2Captain: '',
      isValid: {
        team1Captain: null,
        team2Captain: null,
      },
      feedback: {
        team1Captain: null,
        team2Captain: null,
      },
    };
    bindMethods(this);
  }

  handlers = {
    onButtonClick() {

    },
  };


  componentDidMount() {
    fetcher
      .get('players')
      .then(response => {
        this.setState({players: response.data})
      });
  }


  render() {
    const getCheckboxOnChange = (i) => {
      return (e) => this.props.onChange({[e.target.checked ? 'select' : 'unselect']: i});
    };
    // if checkbox is checked, key is 'select' and 'unselect otherwise. value is the index
    const mapper = (player, i) => {
      return (
        <CheckBoxControl name={`cb-${player.jerseyNo}`} onChange={getCheckboxOnChange(i)}>
          {`${toTitleCase(player.name)} (${player.jerseyNo})`}
        </CheckBoxControl>
      );
    };
    const team1CandidatePlayers = subtract(this.state.players, this.state.team2Players).map(
      (player, i) => {
        return (<li key={player._id} className="list-group-item bg-transparent flex-fill">{mapper(player, i)}</li>);
      },
    );
    const team2CandidatePlayers = subtract(this.state.players, this.state.team1Players).map(
      (player, i) => {
        return (<li key={player._id} className="list-group-item bg-transparent flex-fill">{mapper(player, i)}</li>);
      },
    );

    return (
      <CenterContent>
        <h2 className="text-center text-white bg-success py-3 rounded">{this.props.name}</h2>
        <div className="row">
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team1.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select" options={this.state.team1Players}
                       name="team1-captain" value={this.state.team1Captain}
                       onChange={(e) => this.onChange({team1Captain: e.target.value})}
                       isValid={this.state.isValid.team1Captain}
                       feedback={this.state.feedback.team1Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team1CandidatePlayers}</ul>
              </div>
            </div>
          </div>
          <div className="col">
            <h2 className="text-center text-primary">{this.props.team2.name}</h2>
            <hr/>
            <FormGroup label="Captain" type="select" options={this.state.team1Players}
                       name="team2-captain" value={this.state.team2Captain}
                       onChange={(e) => this.onChange({team2Captain: e.target.value})}
                       isValid={this.state.isValid.team2Captain}
                       feedback={this.state.feedback.team2Captain}/>
            <div className="form-group row">
              <label className="col-form-label col-md-4 col-lg-3">
                Choose Players
              </label>
              <div className="col">
                <ul className="list-group-select">{team2CandidatePlayers}</ul>
              </div>
            </div>
          </div>

        </div>
        <FormButton type="button" text="Begin Match" btnClass="outline-primary"
                    offsetCol="offset-0 text-center mt-3" onClick={this.onButtonClick}>
        </FormButton>
      </CenterContent>
    );
  }

}

