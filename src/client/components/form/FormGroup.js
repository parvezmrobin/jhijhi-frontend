/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, {Component} from 'react';
import InputControl from "./control/input";
import SelectControl from "./control/select";
import {toTitleCase} from "../../lib/utils";


class FormGroup extends Component {
  labelCol;

  render() {
    const labelCol = this.props.labelCol || 'col-md-4 col-lg-3';
    const id = this.props.id || this.props.name;
    const type = this.props.type || 'text';
    const label = this.props.label || toTitleCase(this.props.name);

    const inputProps = {
      id,
      name: this.props.name,
      isValid: this.props.isValid,
      onChange: this.props.onChange,
      autoFocus: this.props.autoFocus,
    };

    let control = <InputControl type={type} {...inputProps} value={this.props.value}/>;
    if (type === "select") {
      control = <SelectControl {...inputProps} options={this.props.options} value={this.props.value}/>
    }

    return (<div className="form-group row">
      <label htmlFor={id} className={'col-form-label ' + labelCol}>
        {label}
      </label>
      <div className="col">
        {control}
        <div className="invalid-feedback">{this.props.feedback}</div>
      </div>
    </div>);
  }
}

export default FormGroup;
