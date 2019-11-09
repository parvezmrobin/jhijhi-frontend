/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import { Link } from "react-router-dom";


function TeamForm(props) {
  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(e)
  };
  const operation = props.team._id ? 'Edit' : 'Create';

  return (
    <Fragment>
      <h2>{operation} Team</h2>
      <hr/>
      <form onSubmit={onSubmit}>
        <FormGroup name="name" value={props.team.name}
                   onChange={(e) => props.onChange({ name: e.target.value })}
                   isValid={props.isValid.name}
                   feedback={props.feedback.name} autoFocus={true}/>
        <FormGroup name="short-name" value={props.team.shortName}
                   onChange={(e) => props.onChange({ shortName: e.target.value })}
                   isValid={props.isValid.shortName}
                   feedback={props.feedback.shortName}/>

        <FormButton type="submit" text={operation} btnClass="outline-success">
          {props.team._id &&
          <label className="col-form-label float-right"><Link to="/team">Create</Link> a team instead</label>}
        </FormButton>
      </form>
    </Fragment>
  );
}

export default TeamForm;
