/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, { Fragment } from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import { Link } from "react-router-dom";


function UmpireForm(props) {
  const operation = props.values._id ? 'Edit' : 'Create';
  const onSubmit = e => {
    e.preventDefault();
    props.onSubmit(e);
  };
  return (
    <Fragment>
      <h2>{operation} Umpire</h2>
      <hr/>
      <form onSubmit={onSubmit}>
        <FormGroup name="name" onChange={e => props.onChange({ name: e.target.value })}
                   value={props.values.name} isValid={props.isValid.name}
                   feedback={props.feedback.name} autoFocus={true}/>
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {props.values._id &&
          <label className="col-form-label float-right"><Link to="/umpire">Create</Link> a umpire instead</label>}
        </FormButton>
      </form>
    </Fragment>
  );
}

export default UmpireForm;
