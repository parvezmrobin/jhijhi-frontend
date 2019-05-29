/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';
import { Link } from 'react-router-dom';


function PlayerForm(props) {
  const operation = props.values._id ? 'Edit' : 'Create';
  const child = !props.values._id ? null :
    <label className="col-form-label float-right"><Link to="/player">Create</Link> a player instead</label>;
  return (
    <Fragment>
      <h2>{operation} Player</h2>
      <hr/>
      <form onSubmit={e => {
        e.preventDefault();
        props.onSubmit(e);
      }}>
        <FormGroup name="name" onChange={e => props.onChange({ name: e.target.value })}
                   value={props.values.name} isValid={props.isValid.name}
                   feedback={props.feedback.name} autoFocus={true}/>
        <FormGroup name="jersey-no" onChange={e => props.onChange({ jerseyNo: e.target.value })}
                   value={props.values.jerseyNo} isValid={props.isValid.jerseyNo}
                   feedback={props.feedback.jerseyNo}/>
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {child}
        </FormButton>
      </form>
    </Fragment>
  );
}

export default PlayerForm;
