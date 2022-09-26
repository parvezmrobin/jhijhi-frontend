/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { Link } from 'react-router-dom';
import { func, shape } from 'prop-types';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import { makeFeedbackType, makeIsValidType, Team as TeamType } from '../../types';


function TeamForm({
  team, isValid, feedback, onChange, onSubmit: propOnSubmit,
}) {
  const onSubmit = (e) => {
    e.preventDefault();
    propOnSubmit(e);
  };
  const operation = team._id ? 'Edit' : 'Create';

  return (
    <>
      <h2>
        {operation}
        &nbsp;Team
      </h2>
      <hr />
      <form onSubmit={onSubmit}>
        <FormGroup
          name="name"
          value={team.name}
          onChange={(e) => onChange({ name: e.target.value })}
          isValid={isValid.name}
          feedback={feedback.name}
          autoFocus
        />
        <FormGroup
          name="short-name"
          value={team.shortName}
          onChange={(e) => onChange({ shortName: e.target.value })}
          isValid={isValid.shortName}
          feedback={feedback.shortName}
        />

        <FormButton type="submit" text={operation} btnClass="outline-success">
          {team._id && (
          <span className="col-form-label float-right">
            <Link to="/team">Create</Link>
            {' '}
                a team instead
          </span>
          )}
        </FormButton>
      </form>
    </>
  );
}

TeamForm.propTypes = {
  team: shape(TeamType).isRequired,
  isValid: shape(makeIsValidType(TeamType)).isRequired,
  feedback: shape(makeFeedbackType(TeamType)).isRequired,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
};

export default TeamForm;
