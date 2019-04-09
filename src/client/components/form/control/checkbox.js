/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, {Component} from "react";


class CheckBoxControl extends Component {

  render() {
    const id = this.props.id || this.props.name;

    return (
      <div className="form-check">
        <input className="form-check-input" type="checkbox" value={this.props.value} id={id} name={this.props.name}
               onChange={this.props.onChange}/>
        <label className="form-check-label" htmlFor={id}>
          {this.props.children}
        </label>
      </div>
    );
  }

}

export default CheckBoxControl;
