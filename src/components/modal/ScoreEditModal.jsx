/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Jun 01, 2019
 */

import React from 'react';
import PropTypes, { shape } from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import ScoreEdit from '../score/ScoreEdit';
import { ordinal } from '../../lib/utils';
import Bowl from '../bowl/Bowl';
import { BowlType, PlayerType } from '../../types';

function ScoreEditModal(props) {
  const {
    isOpen,
    close,
    matchId,
    overNo,
    bowlNo,
    onInput,
    batsmen,
    batsmanIndices,
    bowl,
  } = props;

  return (
    <Modal isOpen={isOpen} size="lg" toggle={close} contentClassName="bg-dark">
      <ModalHeader className="border-0 text-white" tag="h4" toggle={close}>
        {overNo + 1}
        <sup>{ordinal(overNo + 1)}</sup> Over, Bowl {bowlNo + 1}
      </ModalHeader>
      <ModalBody>
        <div className="pb-3">
          <h4 className="text-warning font-weight-light">
            With great power comes great responsibility!
          </h4>
          <h5 className="text-warning font-weight-light pb-2">
            We are letting you edit your score without any validation.
            Therefore, it is your responsibility that the scores are consistent
            after the edit.
          </h5>
          <ul className="list-group">
            <Bowl battingTeam={batsmen} bowl={bowl} bowlNo={bowlNo + 1} />
          </ul>
        </div>
        <ScoreEdit
          className="compact"
          matchId={matchId}
          battingTeamPlayers={batsmen}
          batsmanIndices={batsmanIndices}
          overNo={overNo}
          bowlNo={bowlNo}
          onInput={onInput}
        />
      </ModalBody>
      <ModalFooter className="border-0">
        <Button color="info" onClick={close}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

ScoreEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  batsmen: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  batsmanIndices: PropTypes.arrayOf(PropTypes.number).isRequired,
  bowl: shape(BowlType).isRequired,
  matchId: PropTypes.string.isRequired,
  overNo: PropTypes.number.isRequired,
  bowlNo: PropTypes.number.isRequired,
  onInput: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
};

export default ScoreEditModal;
