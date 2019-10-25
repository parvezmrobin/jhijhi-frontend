/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import PropTypes from 'prop-types';


function InputControl(props) {
  const p = Object.assign({}, props);
  let className = 'form-control ';
  if (p.isValid === true) {
    className += 'is-valid';
  } else if (p.isValid === false) {
    className += 'is-invalid';
  }
  delete p.isValid;

  return <input className={className} {...p}/>;
}

InputControl.propTypes = {
  value: PropTypes.string.isRequired,
  isValid: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};


export default InputControl;
