/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';


class CenterContent extends Component {
  render() {
    const col = this.props.col || 'col';

    return (
      <div className="vh-100 d-flex align-items-center justify-content-center">
        <div className={col}>
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default CenterContent;
