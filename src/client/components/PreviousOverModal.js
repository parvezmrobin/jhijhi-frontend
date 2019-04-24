import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { optional, toTitleCase } from '../lib/utils';
import CurrentOver from './CurrentOver';
import * as PropTypes from 'prop-types';
import React from 'react';

export default function PreviousOverModal(props) {
  return <Modal isOpen={props.overModal.open} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle} className="text-primary">
      Bowled by&nbsp;
      <span className="font-italic">
            {toTitleCase(optional(props.bowlingTeamPlayers[props.overModal.over.bowledBy]).name)}
          </span>
      (Over {props.overModal.overNo})
    </ModalHeader>
    <ModalBody>
      <CurrentOver balls={props.overModal.over.bowls} battingTeam={props.battingTeamPlayers}/>
    </ModalBody>
    <ModalFooter>
      <Button color="secondary" onClick={props.toggle}>Close</Button>
    </ModalFooter>
  </Modal>;
}

PreviousOverModal.propTypes = {
  overModal: PropTypes.object,
  toggle: PropTypes.func,
  bowlingTeamPlayers: PropTypes.array,
  battingTeamPlayers: PropTypes.array,
};
