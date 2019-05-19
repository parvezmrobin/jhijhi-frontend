import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FormGroup from './form/FormGroup';
import * as PropTypes from 'prop-types';
import { bindMethods } from '../lib/utils';

export default class BatsmanSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batsman1Id: '',
      batsman2Id: '',
      errors: {
        batsman1: null,
        batsman2: null,
      },
    };

    bindMethods(this);
  }

  handlers = {
    onSubmit() {
      const { batsman1Id, batsman2Id } = this.state;
      const batsman1Exists = Number.isInteger(this.props.batsman1Index);
      const batsman2Exists = Number.isInteger(this.props.batsman2Index);
      if (batsman1Id === batsman2Id) {
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
        batsman1Id,
        batsman2Id,
      });
      return this.setState({ errors });
    },

    onSelectionChange(newValue) {
      this.setState({ ...newValue });
    },

    initialize() {
      const batsman1Exists = Number.isInteger(this.props.batsman1Index);
      const batsman2Exists = Number.isInteger(this.props.batsman2Index);
      const { batsmanList } = this.props;
      const initialBatsmanSelection = {};
      if (!batsman1Exists) {
        initialBatsmanSelection.batsman1Id = batsmanList[0]._id;
      }
      if (!batsman2Exists) {
        initialBatsmanSelection.batsman2Id = batsmanList[0]._id;
      }

      this.setState({ ...initialBatsmanSelection });
    },
  };


  render() {
    const { batsman1Index, batsman2Index, batsmanList, isOpen } = this.props;
    const batsman1Exists = Number.isInteger(batsman1Index);
    const batsman2Exists = Number.isInteger(batsman2Index);
    const { errors } = this.state;
    return <Modal isOpen={isOpen} onOpened={this.initialize}>
      <ModalHeader className="text-primary">
        Select {!(batsman1Exists || batsman2Exists) ? 'Batsmen' : 'Batsman'}
      </ModalHeader>
      <ModalBody>
        {!batsman1Exists &&
        <FormGroup type="select" name="batsman-1" value={this.state.batsman1Id}
                   onChange={e => this.onSelectionChange({ batsman1Id: e.target.value })}
                   isValid={(!errors.batsman1) ? null : false}
                   feedback={errors.batsman1}
                   options={batsmanList}/>}
        {!batsman2Exists &&
        <FormGroup type="select" name="batsman-2" value={this.state.batsman2Id}
                   onChange={e => this.onSelectionChange({ batsman2Id: e.target.value })}
                   isValid={(!errors.batsman2) ? null : false}
                   feedback={errors.batsman2}
                   options={batsmanList}/>}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.onSubmit}>Select</Button>
      </ModalFooter>
    </Modal>;
  }
}

BatsmanSelectModal.propTypes = {
  isOpen: PropTypes.bool,
  batsman1Index: PropTypes.number,
  batsman2Index: PropTypes.number,
  batsmanList: PropTypes.array,
  onSelect: PropTypes.func,
};
