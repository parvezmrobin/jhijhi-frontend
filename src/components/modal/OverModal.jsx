import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as PropTypes from 'prop-types';
import React, { Component } from 'react';
import { number, shape } from 'prop-types';
import { optional, toTitleCase } from '../../lib/utils';
import CurrentOver from '../over/CurrentOver';
import ScoreEdit from '../score/ScoreEdit';
import { BowlType, PlayerType } from '../../types';

export default class OverModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      size: 'md',
      isEditing: {
        show: false,
        overIndex: -1,
        bowlIndex: -1,
      },
    };
  }

  showEdit = (overIndex, bowlIndex) => {
    const { onEditClick } = this.props;
    onEditClick(overIndex, bowlIndex);
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
    const { toggle } = this.props;
    toggle();
  };

  render() {
    const {
      overModal,
      bowlingTeamPlayers,
      battingTeamPlayers,
      batsmanIndices,
      matchId,
      onEdit,
    } = this.props;
    const { over, overIndex, open } = overModal;
    const {
      isEditing: { show: showEdit, bowlIndex },
      size: modalSize,
    } = this.state;
    return (
      <Modal isOpen={open} size={modalSize} toggle={this.close}>
        <ModalHeader toggle={this.close} className="text-primary border-0">
          Bowled by&nbsp;
          <span className="font-italic">
            {toTitleCase(optional(bowlingTeamPlayers[over.bowledBy]).name)}
          </span>
          (Over {overIndex + 1})
        </ModalHeader>
        <ModalBody>
          {over.bowls && (
            <CurrentOver
              className={`pb-2 ${
                modalSize === 'md' ? 'col' : 'col-lg-6 offset-lg-3'
              }`}
              onEdit={this.showEdit}
              overNo={overIndex}
              bowls={over.bowls}
              battingTeam={battingTeamPlayers}
              activeIndex={bowlIndex}
            />
          )}
          {showEdit && (
            <ScoreEdit
              overNo={overIndex}
              bowlNo={bowlIndex}
              matchId={matchId}
              battingTeamPlayers={battingTeamPlayers}
              batsmanIndices={batsmanIndices}
              onInput={onEdit}
            />
          )}
        </ModalBody>
        <ModalFooter className="border-0">
          <Button color="secondary" onClick={this.close}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

OverModal.propTypes = {
  overModal: PropTypes.shape({
    over: PropTypes.shape({
      bowledBy: PropTypes.number,
      bowls: PropTypes.arrayOf(shape(BowlType)),
    }).isRequired,
    overIndex: PropTypes.number,
    open: PropTypes.bool,
  }).isRequired,
  toggle: PropTypes.func.isRequired,
  bowlingTeamPlayers: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  battingTeamPlayers: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  matchId: PropTypes.string.isRequired,
  batsmanIndices: PropTypes.arrayOf(number).isRequired,
  onEdit: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
};
