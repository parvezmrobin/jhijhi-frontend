/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, {Component, Fragment} from 'react';
import FormGroup from './form/FormGroup';
import FormButton from './form/FormButton';


class PlayerForm extends Component {

  render() {
    return (
      <Fragment>
        <h2>Create Player</h2>
        <hr/>
        <form onSubmit={e => {
          e.preventDefault();
          this.props.onSubmit(e)
        }}>
          <FormGroup name="name"
                     onChange={e => this.props.onChange({name: e.target.value})}
                     value={this.props.values.name}
                     isValid={this.props.isValid.name}
                     feedback={this.props.feedback.name}/>
          <FormGroup name="jersey-no"
                     onChange={e => this.props.onChange({jerseyNo: e.target.value})}
                     value={this.props.values.jerseyNo}
                     isValid={this.props.isValid.jerseyNo}
                     feedback={this.props.feedback.jerseyNo}/>
          <FormButton type="submit" text="Create" btnClass="outline-success">
            {this.props.children}
          </FormButton>
        </form>
      </Fragment>
    );
  }

}

export default PlayerForm;
