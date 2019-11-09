/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import { Link } from "react-router-dom";

function MatchForm(props) {
  const operation = props.values._id ? 'Edit' : 'Create';
  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(e);
  };
  return (
    <Fragment>
      <h2>{operation} Match</h2>
      <hr/>
      <form onSubmit={onSubmit}>
        <FormGroup name="name" value={props.values.name} autoFocus
                   onChange={(e) => props.onChange({ name: e.target.value })}
                   isValid={props.isValid.name} feedback={props.feedback.name}/>
        <FormGroup name="team-1" type="select" options={props.teams} value={props.values.team1}
                   onChange={(e) => props.onChange({ team1: e.target.value })}
                   isValid={props.isValid.team1} feedback={props.feedback.team1}/>
        <FormGroup name="team-2" type="select" options={props.teams} value={props.values.team2}
                   onChange={(e) => props.onChange({ team2: e.target.value })}
                   isValid={props.isValid.team2} feedback={props.feedback.team2}/>
        <FormGroup name="umpire-1" type="select" options={props.umpires} value={props.values.umpire1}
                   onChange={(e) => props.onChange({ umpire1: e.target.value })}
                   isValid={props.isValid.umpire1} feedback={props.feedback.umpire1}/>
        <FormGroup name="umpire-2" type="select" options={props.umpires} value={props.values.umpire2}
                   onChange={(e) => props.onChange({ umpire2: e.target.value })}
                   isValid={props.isValid.umpire2} feedback={props.feedback.umpire2}/>
        <FormGroup name="umpire-3" type="select" options={props.umpires} value={props.values.umpire3}
                   onChange={(e) => props.onChange({ umpire3: e.target.value })}
                   isValid={props.isValid.umpire3} feedback={props.feedback.umpire3}/>
        <FormGroup name="overs" type="number" value={props.values.overs}
                   onChange={(e) => props.onChange({ overs: e.target.value })}
                   isValid={props.isValid.overs} feedback={props.feedback.overs}/>
        <FormGroup name="tag" type="tag" value={props.values.tags} options={props.tags}
                   onChange={(e) => props.onChange({ tags: e.target.value })}
                   isValid={props.isValid.tags} feedback={props.feedback.tags}/>
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {props.values._id &&
          <label className="col-form-label float-right"><Link to="/match">Create</Link> a match instead</label>}
        </FormButton>
      </form>
    </Fragment>
  );
}

export default MatchForm;
