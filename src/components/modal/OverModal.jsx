import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { optional, toTitleCase } from '../../lib/utils';
import CurrentOver from '../over/CurrentOver';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import ScoreEdit from '../score/ScoreEdit';

export default class OverModal extends Component {
  state = {
    size: 'md',
    isEditing: {
      show: false,
      overIndex: -1,
      bowlIndex: -1,
    },
  };

  showEdit = (overIndex, bowlIndex) => {
    this.props.onEditClick(overIndex, bowlIndex);
    this.setState({
      size: 'xl',
      isEditing: {
        show: true,
        overIndex,
        bowlIndex,
      },
    });
  };

  close = () => {
    this.setState({
      size: 'md',
      isEditing: {
        show: false,
        overIndex: -1,
        bowlIndex: -1,
      },
    });
    this.props.toggle();
  };

  render() {
    const { overModal, bowlingTeamPlayers, battingTeamPlayers, batsmanIndices, matchId, onEdit } = this.props;
    const { over, overIndex, open } = overModal;
    const { isEditing: { show: showEdit, bowlIndex }, size: modalSize } = this.state;
    return <Modal isOpen={open} size={modalSize} toggle={this.close}>
      <ModalHeader toggle={this.close} className="text-primary border-0">
        Bowled by&nbsp;
        <span className="font-italic">
            {toTitleCase(optional(bowlingTeamPlayers[over.bowledBy]).name)}
          </span>
        (Over {overIndex + 1})
      </ModalHeader>
      <ModalBody>
        {over.bowls &&
        <CurrentOver
          className={`pb-2 ${(modalSize === 'md') ? 'col' : 'col-lg-6 offset-lg-3'}`}
          onEdit={this.showEdit} overNo={overIndex} bowls={over.bowls}
          battingTeam={battingTeamPlayers} activeIndex={bowlIndex}/>}
        {showEdit &&
        <ScoreEdit overNo={overIndex} bowlNo={bowlIndex} matchId={matchId}
                   batsmen={battingTeamPlayers} batsmanIndices={batsmanIndices} onInput={onEdit}/>}
      </ModalBody>
      <ModalFooter className="border-0">
        <Button color="secondary" onClick={this.close}>Close</Button>
      </ModalFooter>
    </Modal>;
  }
}

OverModal.propTypes = {
  overModal: PropTypes.shape({
    over: PropTypes.shape({
      bowledBy: PropTypes.number,
      bowls: PropTypes.array,
    }).isRequired,
    overIndex: PropTypes.number,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  bowlingTeamPlayers: PropTypes.array.isRequired,
  battingTeamPlayers: PropTypes.array.isRequired,
  matchId: PropTypes.string.isRequired,
  batsmanIndices: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
