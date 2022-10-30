/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { Named } from '../../../types';

function SelectControl(props) {
  const p = { ...props };
  let className = 'form-control ';
  if (p.isValid === true) {
    className += 'is-valid';
  } else if (p.isValid === false) {
    className += 'is-invalid';
  }
  p.id = p.id || p.name;
  const _render = p.render || ((opt) => opt.name);

  delete p.isValid;
  delete p.options;
  delete p.render;

  const { options } = props;
  const optionsEls = options.map((option) => (
    <option key={option._id} value={option._id}>
      {_render(option)}
    </option>
  ));
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <select className={className} {...p}>
      {optionsEls}
    </select>
  );
}

SelectControl.propTypes = {
  id: string,
  name: string.isRequired,
  options: arrayOf(shape(Named)).isRequired,
  render: func,
};

export default SelectControl;
