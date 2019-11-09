import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import FormGroup from "../components/form/FormGroup";
import FormButton from "../components/form/FormButton";
import Notification from "../components/Notification";
import fetcher from "../lib/fetcher";
import ErrorModal from "../components/modal/ErrorModal";
import { formatValidationFeedback } from "../lib/utils";


export default class ChangePassword extends Component {
  state = {
    values: {
      current: '',
      new: '',
      confirm: '',
    },
    isValid: { current: null, new: null },
    feedback: { current: null, new: null },
    message: null,
    showErrorModal: false,
  };

  onSubmit = (e) => {
    e.preventDefault();

    const updateData = { ...this.state.values };

    return fetcher
      .put('auth/password', updateData)
      .then(response => this.setState(prevState => ({
        ...prevState,
        values: {
          current: '',
          new: '',
          confirm: '',
        },
        isValid: { current: null, new: null },
        feedback: { current: null, new: null },
        message: response.data.message,
      })))
      .catch(err => {
        const { isValid, feedback } = formatValidationFeedback(err);
        this.setState({
          isValid,
          feedback,
        });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  onChange = (changedState) => {
    this.setState(prevState => ({values: {...prevState.values, ...changedState}}));
  };

  render() {
    const { values, isValid, feedback } = this.state;

    return (
      <div className="container-fluid">
        <Notification message={this.state.message} toggle={() => this.setState({ message: null })}/>
        <CenterContent col="col-xl-4 col-lg-6 col-md-8 col-sm-10">
          <h2>Change Password</h2>
          <hr/>
          <form onSubmit={this.onSubmit}>
            <FormGroup name="current-password" type="password"
                       onChange={e => this.onChange({ current: e.target.value })}
                       value={values.current} isValid={isValid.current}
                       feedback={feedback.current} autoFocus={true}/>
            <FormGroup name="new-password" type="password" onChange={e => this.onChange({ new: e.target.value })}
                       value={values.new} isValid={isValid.new}
                       feedback={feedback.new}/>
            <FormGroup name="confirm" type="password" onChange={e => this.onChange({ confirm: e.target.value })}
                       value={values.confirm}/>
            <FormButton type="submit" text="Change" btnClass="outline-success"/>
          </form>
        </CenterContent>
        <ErrorModal isOpen={this.state.showErrorModal} close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }
}
