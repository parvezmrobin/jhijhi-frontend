/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import { makeFeedbackType, makeIsValidType, PlayerType } from '../../types';

function PlayerForm({
  values,
  isValid,
  feedback,
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
      <h2>{operation} Player</h2>
      <hr />
      <form onSubmit={onSubmit}>
        <FormGroup
          name="name"
          onChange={(e) => onChange({ name: e.target.value })}
          value={values.name}
          isValid={isValid.name}
          feedback={feedback.name}
          autoFocus
        />
        <FormGroup
          name="jersey-no"
          onChange={(e) => onChange({ jerseyNo: e.target.value })}
          value={values.jerseyNo}
          isValid={isValid.jerseyNo}
          feedback={feedback.jerseyNo}
        />
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {values._id && (
            <span className="col-form-label float-right">
              <Link to="/player">Create</Link>
              &nbsp;a player instead
            </span>
          )}
        </FormButton>
      </form>
    </>
  );
}

PlayerForm.propTypes = {
  values: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string.isRequired,
    jerseyNo: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  isValid: PropTypes.shape(makeIsValidType(PlayerType)).isRequired,
  feedback: PropTypes.shape(makeFeedbackType(PlayerType)).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default PlayerForm;
