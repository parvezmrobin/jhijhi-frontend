/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import CreatableSelect from 'react-select/creatable';
import PropTypes from 'prop-types';

function TagControl(props) {
  const { isValid, options, onChange, value } = props;
  let className = 'form-control tag ';
  if (isValid === true) {
    className += 'is-valid';
  } else if (isValid === false) {
    className += 'is-invalid';
  }

  const handleChange = (newValue) => {
    const mappedValue = (newValue || []).map((obj) => obj.value);
    onChange({ target: { value: mappedValue } }); // simulating e.target.value
  };

  const mappedOptions = options.map((option) => ({
    label: option,
    value: option,
  }));
  return (
    <CreatableSelect
      className={className}
      classNamePrefix="tag"
      placeholder="Insert tags for easy searching"
      formatCreateLabel={(lbl) => lbl}
      isClearable
      isMulti
      closeMenuOnSelect={false}
      menuPlacement="auto"
      hideSelectedOptions
      onChange={handleChange}
      options={mappedOptions}
      value={value.map((val) => ({ label: val, value: val }))}
    />
  );
}

TagControl.propTypes = {
  isValid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TagControl;
