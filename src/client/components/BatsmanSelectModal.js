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
      errors: {
        batsman1: null,
        batsman2: null,
      },
    };

    bindMethods(this);
  }

  handlers = {
    onSubmit() {
      const { batsman1, batsman2 } = this.state;
      const batsman1Exists = Number.isInteger(this.props.batsman1);
      const batsman2Exists = Number.isInteger(this.props.batsman2);
      if (batsman1 === batsman2) {
        const errors = {
          batsman1: null,
          batsman2: null,
        };
        if (!batsman1Exists) {
          errors.batsman1 = 'Batsman 1 and Batsman 2 must be different';
        } else if (!batsman2Exists) {
          errors.batsman2 = 'Batsman 1 and Batsman 2 must be different';
        }
        return this.setState({ errors });
      }

      const errors = this.props.onSelect({
        batsman1,
        batsman2,
      });
      return this.setState({ errors });
    },
    onSelectionChange(newValue) {
      this.setState({ ...newValue });
    },
    initialize() {
      const batsman1Exists = Number.isInteger(this.props.batsman1);
      const batsman2Exists = Number.isInteger(this.props.batsman2);
      const { options } = this.props;
      const initialBatsmanSelection = {};
      if (!batsman1Exists) {
        initialBatsmanSelection.batsman1 = options[0]._id;
      }
      if (!batsman2Exists) {
        initialBatsmanSelection.batsman2 = options[0]._id;
      }

      this.setState({ ...initialBatsmanSelection });
    },
  };


  render() {
    const batsman1Exists = Number.isInteger(this.props.batsman1);
    const batsman2Exists = Number.isInteger(this.props.batsman2);
    const { options } = this.props;
    const { errors } = this.state;
    return <Modal isOpen={this.props.isOpen} onOpened={this.initialize}>
      <ModalHeader className="text-primary">
        Select {!(batsman1Exists || batsman2Exists) ? 'Batsmen' : 'Batsman'}
      </ModalHeader>
      <ModalBody>
        {!batsman1Exists &&
        <FormGroup type="select" name="batsman-1" value={this.state.batsman1}
                   isValid={(!errors.batsman1) ? null : false}
                   feedback={errors.batsman1}
                   onChange={e => this.onSelectionChange({ batsman1: e.target.value })}
                   options={options}/>}
        {!batsman2Exists &&
        <FormGroup type="select" name="batsman-2" value={this.state.batsman2}
                   isValid={(!errors.batsman2) ? null : false}
                   feedback={errors.batsman2}
                   onChange={e => this.onSelectionChange({ batsman2: e.target.value })}
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
  onSelect: PropTypes.func,
};
