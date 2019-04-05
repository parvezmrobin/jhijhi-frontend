/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../layouts/CenterContent';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';


class AuthForm extends Component {
  btnText;
  onSubmit;
  confirmPassword;

  render() {
    const action = this.props.action || "";
    const btnClass = this.props.btnClass || "outline-primary";
    const btnText = this.props.btnText || this.props.title;
    const confirmPasswordField = this.props.confirmPassword &&
      <FormGroup name="confirm-password" type="password" value={this.props.values.confirm}
                 onChange={e => this.props.onChange({confirm: e.target.value})}/>;

    return (
      <CenterContent col="col-md-8 col-lg-6 col-xl-5">
        <h2>{this.props.title}</h2>
        <hr/>
        <form onSubmit={e => {e.preventDefault(); this.props.onSubmit(e)}} action={action} method="post">
          <FormGroup name="username" value={this.props.values.username}
                     onChange={e => this.props.onChange({username: e.target.value})}/>
          <FormGroup name="password" type="password" value={this.props.values.password}
                     onChange={e => this.props.onChange({password: e.target.value})}/>
          {confirmPasswordField}
          <FormButton type="submit" text={btnText} btnClass={btnClass}>
            {this.props.children}
          </FormButton>
        </form>
      </CenterContent>
    );
  }

}

export default AuthForm
