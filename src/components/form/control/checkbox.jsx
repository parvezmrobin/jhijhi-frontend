/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, { Component } from 'react';


class CheckBoxControl extends Component {

  render() {
    const { name, value, children, onChange } = this.props;
    const { id = name } = this.props;

    return (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" checked={value} id={id} name={name}
               onChange={onChange}/>
        <label className="form-check-label" htmlFor={id}>
          {children}
        </label>
      </div>
    );
  }

}

export default CheckBoxControl;
