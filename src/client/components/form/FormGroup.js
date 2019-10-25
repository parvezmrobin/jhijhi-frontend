/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React from 'react';
import InputControl from './control/input';
import SelectControl from './control/select';
import TagControl from './control/tag';
import { toTitleCase } from '../../lib/utils';
import PropTypes from 'prop-types';


function FormGroup(props) {
  const labelCol = props.labelCol || 'col-md-4 col-lg-3';
  const id = props.id || props.name;
  const type = props.type || 'text';
  const label = props.label || toTitleCase(props.name);

  const inputProps = {
    id,
    name: props.name,
    isValid: props.isValid,
    onChange: props.onChange,
    autoFocus: props.autoFocus,
  };

  let control = <InputControl type={type} {...inputProps} value={props.value}/>;
  if (type === 'select') {
    control = <SelectControl {...inputProps} options={props.options} value={props.value}/>;
  } else if (type === 'tag') {
    control = <TagControl {...inputProps} options={props.options} value={props.value} />
  }

  return (<div className="form-group row">
    <label htmlFor={id} className={'col-form-label ' + labelCol}>
      {label}
    </label>
    <div className="col">
      {control}
      <div className="invalid-feedback">{props.feedback}</div>
    </div>
  </div>);
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
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  options: PropTypes.array,
};


export default FormGroup;
