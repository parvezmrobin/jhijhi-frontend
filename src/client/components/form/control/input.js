/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, {Component} from "react";


class InputControl extends Component {

  render() {
    const props = {...this.props};
    let className = "form-control ";
    if (props.isValid === true) {
      className += "is-valid";
    } else if (props.isValid === false) {
      className += "is-invalid";
    }
    delete props.isValid;
    return (
      <input className={className} {...props}/>
    );
  }

}

export default InputControl;
