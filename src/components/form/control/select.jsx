/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from "react";


function SelectControl(props) {
  const p = { ...props };
  let className = "form-control ";
  if (p.isValid === true) {
    className += "is-valid";
  } else if (p.isValid === false) {
    className += "is-invalid";
  }
  p.id = props.id || props.name;
  delete p.isValid;
  delete p.options;

  const options = props.options.map(option => <option key={option._id} value={option._id}>{option.name}</option>);
  return (
    <select className={className} {...p}>{options}</select>
  );
}

export default SelectControl;
