/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import { bool, func, node, string } from 'prop-types';

function CheckBoxControl({ name, value, children, onChange, id: _id }) {
  const id = _id || name;

  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={value}
        id={id}
        name={name}
        onChange={onChange}
      />
      <label className="form-check-label" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}

CheckBoxControl.propTypes = {
  id: string,
  name: string.isRequired,
  value: bool.isRequired,
  children: node,
  onChange: func,
};

export default CheckBoxControl;
