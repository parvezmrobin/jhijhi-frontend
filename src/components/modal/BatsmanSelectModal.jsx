import React, { Component } from 'react';
import {
  Button,
  CustomInput,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import FormGroup from '../form/FormGroup';
import { bindMethods } from '../../lib/utils';
import { PlayerType } from '../../types';

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
      const { batsman1Index, batsman2Index, onSelect } = this.props;
      const { batsman1Id, batsman2Id } = this.state;
      const batsman1Exists = Number.isInteger(batsman1Index);
      const batsman2Exists = Number.isInteger(batsman2Index);
      const { singleBatsman } = this.props;

      if (!singleBatsman && batsman1Id === batsman2Id) {
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

      const batsmanSelectEvent = {
        batsman1Id,
      };
      if (!singleBatsman) {
        batsmanSelectEvent.batsman2Id = batsman2Id;
      }
      const errors = onSelect(batsmanSelectEvent);
      return this.setState({ errors });
    },

    onSelectionChange(newValue) {
      this.setState({ ...newValue });
    },
  };

  /**
   * whether `batsman1Index`, `batsman2Index` or `batsmanList` updates
   * reinitialize batsmenId selection
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const batsman1Exists = Number.isInteger(nextProps.batsman1Index);
    const batsman2Exists = Number.isInteger(nextProps.batsman2Index);
    const { batsmanList } = nextProps;
    const initialBatsmanSelection = {};
    if (!batsman1Exists) {
      initialBatsmanSelection.batsman1Id = batsmanList[0]._id;
    }
    if (!batsman2Exists) {
      initialBatsmanSelection.batsman2Id = batsmanList[0]._id;
    }

    this.setState({ ...initialBatsmanSelection });
  }

  render() {
    const {
      batsman1Index,
      batsman1Id,
      batsman2Index,
      batsman2Id,
      batsmanList,
      singleBatsman,
      showingSingleBatsmanPrompt,
      onNumberOfBatsmenChange,
    } = this.props;
    const batsman1Exists = Number.isInteger(batsman1Index);
    const batsman2Exists = Number.isInteger(batsman2Index);
    const { errors } = this.state;

    // if 'all out - play with single player?' is not prompted, and
    // either batsman1 is not present or
    // (it's not single batsman game and batsman2 is not present)
    const isModalOpen =
      !showingSingleBatsmanPrompt &&
      (!batsman1Exists || (!singleBatsman && !batsman2Exists));

    // although if `isModalOpen` is false, modal will not be shown but a backdrop will
    // thus if `isModalOpen` is false, render nothing at all
    return (
      isModalOpen && (
        <Modal isOpen={isModalOpen} contentClassName="bg-dark">
          <ModalHeader className="text-info">
            Select {!(batsman1Exists || batsman2Exists) ? 'Batsmen' : 'Batsman'}
          </ModalHeader>
          <ModalBody>
            {!batsman1Exists && (
              <FormGroup
                type="select"
                name="on-crease"
                value={batsman1Id}
                onChange={(e) =>
                  this.onSelectionChange({ batsman1Id: e.target.value })
                }
                isValid={!errors.batsman1 ? null : false}
                feedback={errors.batsman1}
                options={batsmanList}
              />
            )}
            {!batsman2Exists && !singleBatsman && (
              <FormGroup
                type="select"
                name="bowler's-end"
                value={batsman2Id}
                onChange={(e) =>
                  this.onSelectionChange({ batsman2Id: e.target.value })
                }
                isValid={!errors.batsman2 ? null : false}
                feedback={errors.batsman2}
                options={batsmanList}
              />
            )}
          </ModalBody>
          <ModalFooter className="justify-content-between">
            <CustomInput
              type="switch"
              label="Single Batsman"
              id="single-batsman-modal"
              checked={singleBatsman}
              onChange={onNumberOfBatsmenChange}
            />
            <Button color="primary" onClick={this.onSubmit}>
              Select
            </Button>
          </ModalFooter>
        </Modal>
      )
    );
  }
}

BatsmanSelectModal.propTypes = {
  batsman1Index: PropTypes.number,
  batsman1Id: PropTypes.string,
  batsman2Index: PropTypes.number,
  batsman2Id: PropTypes.string,
  batsmanList: PropTypes.arrayOf(shape(PlayerType)),
  singleBatsman: PropTypes.bool,
  onNumberOfBatsmenChange: PropTypes.func,
  onSelect: PropTypes.func,
  showingSingleBatsmanPrompt: PropTypes.bool,
};
