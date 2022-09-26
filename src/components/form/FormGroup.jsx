/* eslint-disable react/jsx-props-no-spreading */
/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */

import React from 'react';
import PropTypes from 'prop-types';
import InputControl from './control/InputControl';
import SelectControl from './control/select';
import TagControl from './control/TagControl';
import { toTitleCase } from '../../lib/utils';
import { Named } from '../../types';

function FormGroup(props) {
  const {
    labelCol = 'col-md-4 col-lg-3',
    name,
    value,
    isValid,
    onChange,
    autoFocus,
    disabled,
    feedback,
  } = props;
  const { id = name, type = 'text', label = toTitleCase(name) } = props;

  const inputProps = {
    id,
    name,
    isValid,
    onChange,
    autoFocus,
    disabled,
  };

  let control;
  if (type === 'select') {
    const { options } = props;
    control = <SelectControl {...inputProps} options={options} value={value} />;
  } else if (type === 'tag') {
    const { options } = props;
    control = <TagControl {...inputProps} options={options} value={value} />;
  } else {
    control = (
      <InputControl type={type} {...inputProps} value={[value.toString()]} />
    );
  }

  return (
    <div className="form-group row">
      <label htmlFor={id} className={`col-form-label ${labelCol}`}>
        {label}
      </label>
      <div className="col">
        {control}
        <div className="invalid-feedback">{feedback}</div>
      </div>
    </div>
  );
}

FormGroup.propTypes = {
  labelCol: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  isValid: PropTypes.bool,
  feedback: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.shape(Named), PropTypes.string]).isRequired
  ),
  disabled: PropTypes.bool,
};

export default FormGroup;
