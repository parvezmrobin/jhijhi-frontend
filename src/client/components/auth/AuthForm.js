/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../layouts/CenterContent';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';


class AuthForm extends Component {
  btnText;

  render() {
    const action = this.props.action || "";
    const btnClass = this.props.btnClass || "outline-primary";
    const btnText = this.props.btnText || this.props.title;

    return (
      <CenterContent col="col-md-10 col-lg-8 col-xl-6">
        <h2>{this.props.title}</h2>
        <hr/>
        <form action={action} method="post">
          <FormGroup name="username"/>
          <FormGroup name="password" type="password"/>
          <FormButton type="submit" text={btnText} btnClass={btnClass}>
            {this.props.children}
          </FormButton>
        </form>
      </CenterContent>
    );
  }

}

export default AuthForm
