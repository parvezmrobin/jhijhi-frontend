import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FormGroup from './form/FormGroup';
import * as PropTypes from 'prop-types';

export default class BatsmanSelectModal extends Component {
  render() {
    const {batsman1, batsman2} = this.props;
    return <Modal isOpen={this.props.isOpen}>
      <ModalHeader className="text-primary">
        Select {!(batsman1 || batsman2) ? 'Batsmen' : 'Batsman'}
      </ModalHeader>
      <ModalBody>
        {!batsman1 && <FormGroup type="select" name="batsman1" options={this.props.options}/>}
        {!batsman2 && <FormGroup type="select" name="batsman2" options={this.props.options}/>}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.props.onClick}>Select</Button>
      </ModalFooter>
    </Modal>;
  }
}

BatsmanSelectModal.propTypes = {
  isOpen: PropTypes.any,
  batsman1: PropTypes.any,
  batsman2: PropTypes.any,
  options: PropTypes.any,
  onClick: PropTypes.func,
};
