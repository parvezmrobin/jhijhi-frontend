/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import CreatableSelect from "react-select/creatable/dist/react-select.esm";
import PropTypes from "prop-types";
import InputControl from "./input";


function TagControl(props) {
  const p = { ...props };
  let className = "form-control tag ";
  if (p.isValid === true) {
    className += "is-valid";
  } else if (p.isValid === false) {
    className += "is-invalid";
  }
  p.id = props.id || props.name;
  delete p.isValid;
  delete p.options;

  const handleChange = (newValue) => {
    const value = (newValue || []).map(obj => obj.value);
    p.onChange({ target: { value } }); // simulating e.target.value
  };

  const options = props.options.map(option => ({ label: option, value: option }));
  return (
    <CreatableSelect
      className={className}
      classNamePrefix="tag"
      placeholder="Insert tags for easy searching"
      formatCreateLabel={lbl => lbl}
      isClearable
      isMulti
      closeMenuOnSelect={false}
      hideSelectedOptions={true}
      onChange={handleChange}
      options={options}
      value={p.value.map(val => ({label: val, value: val}))}
    />
  );
}

InputControl.propTypes = {
  isValid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  value: PropTypes.arrayOf(PropTypes.string),
};

export default TagControl;
