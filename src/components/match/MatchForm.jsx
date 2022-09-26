/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import { Link } from 'react-router-dom';
import {
  arrayOf, func, shape, string,
} from 'prop-types';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import {
  makeFeedbackType,
  makeIsValidType,
  Match as MatchType,
  Team as TeamType,
  Umpire as UmpireType,
} from '../../types';

function MatchForm({
  values,
  teams,
  umpires,
  tags,
  feedback,
  isValid,
  onChange,
  onSubmit: propOnSubmit,
}) {
  const operation = values._id ? 'Edit' : 'Create';
  const onSubmit = (e) => {
    e.preventDefault();
    propOnSubmit(e);
  };
  return (
    <>
      <h2>
        {operation}
        &nbsp;Match
      </h2>
      <hr />
      <form onSubmit={onSubmit}>
        <FormGroup
          name="name"
          value={values.name}
          autoFocus
          onChange={(e) => onChange({ name: e.target.value })}
          isValid={isValid.name}
          feedback={feedback.name}
        />
        <FormGroup
          name="team-1"
          type="select"
          options={teams}
          value={values.team1}
          onChange={(e) => onChange({ team1: e.target.value })}
          isValid={isValid.team1}
          feedback={feedback.team1}
        />
        <FormGroup
          name="team-2"
          type="select"
          options={teams}
          value={values.team2}
          onChange={(e) => onChange({ team2: e.target.value })}
          isValid={isValid.team2}
          feedback={feedback.team2}
        />
        <FormGroup
          name="umpire-1"
          type="select"
          options={umpires}
          value={values.umpire1}
          onChange={(e) => onChange({ umpire1: e.target.value })}
          isValid={isValid.umpire1}
          feedback={feedback.umpire1}
        />
        <FormGroup
          name="umpire-2"
          type="select"
          options={umpires}
          value={values.umpire2}
          onChange={(e) => onChange({ umpire2: e.target.value })}
          isValid={isValid.umpire2}
          feedback={feedback.umpire2}
        />
        <FormGroup
          name="umpire-3"
          type="select"
          options={umpires}
          value={values.umpire3}
          onChange={(e) => onChange({ umpire3: e.target.value })}
          isValid={isValid.umpire3}
          feedback={feedback.umpire3}
        />
        <FormGroup
          name="overs"
          type="number"
          value={values.overs}
          onChange={(e) => onChange({ overs: Number.parseFloat(e.target.value) })}
          isValid={isValid.overs}
          feedback={feedback.overs}
        />
        <FormGroup
          name="tag"
          type="tag"
          value={values.tags}
          options={tags}
          onChange={(e) => onChange({ tags: e.target.value })}
          isValid={isValid.tags}
          feedback={feedback.tags}
        />
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {values._id && (
            <span className="col-form-label float-right">
              <Link to="/match">Create</Link>
              &npsp;a match instead
            </span>
          )}
        </FormButton>
      </form>
    </>
  );
}

MatchForm.propTypes = {
  values: shape(MatchType).isRequired,
  teams: arrayOf(shape(TeamType)).isRequired,
  umpires: arrayOf(shape(UmpireType)).isRequired,
  tags: arrayOf(string).isRequired,
  isValid: shape(makeIsValidType(MatchType)).isRequired,
  feedback: shape(makeFeedbackType(MatchType)).isRequired,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
};

export default MatchForm;
