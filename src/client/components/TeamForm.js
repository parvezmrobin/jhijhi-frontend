/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';


function TeamForm(props) {
  const onSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(e)
  };

  return (
    <Fragment>
      <h2>Create Team</h2>
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

        <FormButton type="submit" text="Create" btnClass="outline-success"/>
      </form>
    </Fragment>
  );
}

export default TeamForm;
