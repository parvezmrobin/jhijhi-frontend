/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React, {Component} from "react";


class SelectControl extends Component {

  render() {
    const options = this.props.options.map(option => <option key={option} value={option}>{option}</option>);
    return (
      <select {...this.props}>{options}</select>
    );
  }

}

export default SelectControl;
