import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FormGroup from './form/FormGroup';
import * as PropTypes from 'prop-types';
import { bindMethods } from '../lib/utils';

export default class BatsmanSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batsman1: '',
      batsman2: '',
      error: null,
    };

    bindMethods(this);
  }

  handlers = {
    onSubmit() {
      const {batsman1, batsman2} = this.state;
      if (batsman1 === batsman2) {
        return this.setState(prevState => ({
          ...prevState,
          error: 'Batsman1 and batsman2 must be different',
        }));
      }

      const {onSelect} = this.props;
      onSelect({batsman1, batsman2});
    },
    onSelectionChange(newValue) {
      this.setState(prevState => ({
        ...prevState,
        ...newValue,
      }))
    },
  };

  componentDidMount() {
    const {options} = this.props;
    this.setState(prevState => ({
      ...prevState,
      batsman1: options[0]._id,
      batsman2: options[0]._id,
    }))
  }

  render() {
    const { batsman1: batsman1Exists, batsman2: batsman2Exists, options } = this.props;
    const { error } = this.state;
    return <Modal isOpen={this.props.isOpen}>
      <ModalHeader className="text-primary">
        Select {!(batsman1Exists || batsman2Exists) ? 'Batsmen' : 'Batsman'}
      </ModalHeader>
      <ModalBody>
        {!batsman1Exists &&
        <FormGroup type="select" name="batsman-1" value={this.state.batsman1}
                    onChange={e => {this.onSelectionChange({batsman1: e.target.value})}}
                   options={options}/>}
        {!batsman2Exists &&
        <FormGroup type="select" name="batsman-2" value={this.state.batsman2}
                   isValid={(error === null) ? null : false}
                   feedback={error}
                   onChange={e => {this.onSelectionChange({batsman2: e.target.value})}}
                   options={options}/>}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.onSubmit}>Select</Button>
      </ModalFooter>
    </Modal>;
  }
}

BatsmanSelectModal.propTypes = {
  isOpen: PropTypes.bool,
  batsman1: PropTypes.any,
  batsman2: PropTypes.any,
  options: PropTypes.array,
  onClick: PropTypes.func,
};
