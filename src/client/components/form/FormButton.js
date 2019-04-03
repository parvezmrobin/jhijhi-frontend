/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';


class FormButton extends Component {
  offsetCol;
  btnClass;

  render() {
    const offsetCol = this.props.offsetCol || 'offset-md-4 offset-lg-3';
    const btnClass = this.props.btnClass || 'outline-success';
    const type = this.props.type || 'button';

    return (
      <div className="form-group row">
        <div className={'col ' + offsetCol}>
          <input type={type} className={'btn btn-' + btnClass} value={this.props.text}/>
          {this.props.children}
        </div>
      </div>
    );
  }

}

export default FormButton;
