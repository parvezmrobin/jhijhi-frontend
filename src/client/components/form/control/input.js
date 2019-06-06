/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import PropTypes from 'prop-types';


function InputControl(props) {
  props = Object.assign({}, props);
  let className = 'form-control ';
  if (props.isValid === true) {
    className += 'is-valid';
  } else if (props.isValid === false) {
    className += 'is-invalid';
  }
  delete props.isValid;
  return (
    <input className={className} {...props}/>
  );
}

InputControl.propTypes = {
  isValid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};


export default InputControl;
