/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ScoreEdit from './ScoreEdit';

class ScoreEditModal extends Component {
  render() {
    const { isOpen, close, matchId, overNo, bowlNo, onInput, batsmen, batsmanIndices } = this.props;
    return (
      <Modal isOpen={isOpen} size="xl" toggle={close} contentClassName="bg-dark">
        <ModalHeader className="border-0 text-white ml-3" tag="h4" toggle={close}>
          Over {overNo} Bowl {bowlNo + 1}
        </ModalHeader>
        <ModalBody className="p-0">
          <ScoreEdit matchId={matchId} batsmen={batsmen} batsmanIndices={batsmanIndices}
                     overNo={overNo} bowlNo={bowlNo} onInput={onInput}/>
        </ModalBody>
        <ModalFooter className="border-0">
          <Button color="info" onClick={close}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

ScoreEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  batsmen: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default ScoreEditModal;
