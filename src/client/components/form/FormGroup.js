/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';


class FormGroup extends Component {
  labelCol;

  static toTitleCase(str) {
    return str
      .split('-')
      .map(word => word[0].toUpperCase() + word.substr(1).toLowerCase())
      .join(' ');
  }

  render() {
    const labelCol = this.props.labelCol || 'col-md-4 col-lg-3';
    const id = this.props.id || this.props.name;
    const type = this.props.type || 'text';
    const label = this.props.label || FormGroup.toTitleCase(this.props.name);

    return <div className="form-group row">
      <label htmlFor={id} className={'col-form-label ' + labelCol}>
        {label}
      </label>
      <div className="col">
        <input type={type} className="form-control" name={this.props.name} id={id}/>
      </div>
    </div>;
  }
}

export default FormGroup;
