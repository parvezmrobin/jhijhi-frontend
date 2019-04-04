/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';


class UmpireForm extends Component{

  render() {
    return (
      <Fragment>
        <h2>Create Umpire</h2>
        <hr/>
        <form>
          <FormGroup name="name"/>
          <FormButton type="submit" text="Create" btnClass="outline-success">
            {this.props.children}
          </FormButton>
        </form>
      </Fragment>
    );
  }

}

export default UmpireForm;
