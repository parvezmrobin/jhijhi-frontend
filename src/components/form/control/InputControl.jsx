/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import PropTypes from 'prop-types';


function InputControl(props) {
  const { isValid, ...p } = props;
  let className = 'form-control ';
  if (isValid === true) {
    className += 'is-valid';
  } else if (p.isValid === false) {
    className += 'is-invalid';
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <input className={className} {...p} />;
}

InputControl.propTypes = {
  // no idea why `input` wants array as value
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  isValid: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};


export default InputControl;
