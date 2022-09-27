/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { shape } from 'prop-types';
import func from 'lodash/fp/min';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';
import { makeFeedbackType, makeIsValidType, UmpireType } from '../../types';

function UmpireForm({
  values,
  isValid,
  feedback,
  onChange,
  onSubmit: propsOnSubmit,
}) {
  const operation = values._id ? 'Edit' : 'Create';
  const onSubmit = (e) => {
    e.preventDefault();
    propsOnSubmit(e);
  };
  return (
    <>
      <h2>{operation} Umpire</h2>
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
        <FormButton type="submit" text={operation} btnClass="outline-success">
          {values._id && (
            <span className="col-form-label float-right">
              <Link to="/umpire">Create</Link>
              &npsp;an umpire instead
            </span>
          )}
        </FormButton>
      </form>
    </>
  );
}

UmpireForm.propTypes = {
  values: shape(UmpireType).isRequired,
  isValid: shape(makeIsValidType(UmpireType)).isRequired,
  feedback: shape(makeFeedbackType(UmpireType)).isRequired,
  onChange: func.isRequired,
  onSubmit: func.isRequired,
};

export default UmpireForm;
