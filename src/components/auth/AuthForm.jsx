/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CenterContent from '../layouts/CenterContent';
import FormGroup from '../form/FormGroup';
import FormButton from '../form/FormButton';


class AuthForm extends Component {
  onSubmit;

  render() {
    const { title, values } = this.props;
    const {
      action = '',
      btnClass = 'outline-primary',
      btnText = title,
      confirmPassword,
      onChange,
      onSubmit,
      isValid,
      feedback,
      children,
    } = this.props;
    const confirmPasswordField = confirmPassword
      && (
      <FormGroup
        name="confirm"
        type="password"
        value={values.confirm}
        onChange={(e) => onChange({ confirm: e.target.value })}
      />
      );

    return (
      <CenterContent col="col-md-8 col-lg-6 col-xl-5">
        <h2>{title}</h2>
        <hr />
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} action={action} method="post">
          <FormGroup
            name="username"
            value={values.username}
            autoFocus
            isValid={isValid.username}
            feedback={feedback.username}
            onChange={(e) => onChange({ username: e.target.value })}
          />
          <FormGroup
            name="password"
            type="password"
            value={values.password}
            isValid={isValid.password}
            feedback={feedback.password}
            onChange={(e) => onChange({ password: e.target.value })}
          />
          {confirmPasswordField}
          <FormButton type="submit" text={btnText} btnClass={btnClass}>
            {children}
          </FormButton>
        </form>
      </CenterContent>
    );
  }
}

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  action: PropTypes.string,
  btnClass: PropTypes.string,
  btnText: PropTypes.string,
  confirmPassword: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.shape({
    username: PropTypes.bool,
    password: PropTypes.bool,
  }).isRequired,
  feedback: PropTypes.shape({
    username: PropTypes.string,
    password: PropTypes.string,
  }).isRequired,
  values: PropTypes.shape({
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirm: PropTypes.string,
  }),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default AuthForm;
