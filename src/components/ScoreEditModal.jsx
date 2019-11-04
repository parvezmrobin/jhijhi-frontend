/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */


import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ScoreEdit from './ScoreEdit';
import { ordinal } from '../lib/utils';
import Bowl from "./Bowl";

function ScoreEditModal(props) {
  const { isOpen, close, matchId, overNo, bowlNo, onInput, batsmen, batsmanIndices, bowl } = props;

  return (
    <Modal isOpen={isOpen} size="xl" toggle={close} contentClassName="bg-dark">
      <ModalHeader className="border-0 text-white ml-3" tag="h4" toggle={close}>
        {overNo + 1}<sup>{ordinal(overNo + 1)}</sup> Over, Bowl {bowlNo + 1}
      </ModalHeader>
      <ModalBody className="p-0">
        <div className="container-fluid mb-5 pl-4 ml-2">
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <Bowl battingTeam={batsmen} bowl={bowl || { boundary: {} }} bowlNo={bowlNo}/>
            </div>
          </div>
        </div>
        <ScoreEdit matchId={matchId} batsmen={batsmen} batsmanIndices={batsmanIndices}
                   overNo={overNo} bowlNo={bowlNo} onInput={onInput}/>
      </ModalBody>
      <ModalFooter className="border-0">
        <Button color="info" onClick={close}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

ScoreEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  batsmen: PropTypes.arrayOf(PropTypes.object).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  bowl: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default ScoreEditModal;
