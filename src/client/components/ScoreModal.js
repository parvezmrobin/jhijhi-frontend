/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 24, 2019
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalBody, ModalHeader, Table } from 'reactstrap';
import { toTitleCase } from '../lib/utils';

class ScoreModal extends Component {
  render() {
    const battingScores = this._calculateBattingScores();
    const rows = battingScores.map(entry => <tr key={entry.name}>
      <th scope="row">{entry.name}</th>
      <td>{entry.runs}</td>
      <td>{entry.bowls || 'Did not bat'}</td>
      <td className={entry.out && 'text-danger'}>{entry.out && toTitleCase(entry.out, ' ')}</td>
    </tr>);
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle} className="border-0">{this.props.battingTeamName}</ModalHeader>
        <ModalBody>
          <Table>
            <thead>
            <tr>
              <th>Name</th>
              <th>Runs</th>
              <th>Bowls</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    );
  }

  _calculateBattingScores() {
    const scores = this.props.battingTeamPlayers.map(player => ({
      name: player.name,
      runs: 0,
      bowls: 0,
      out: null,
    }));

    this.props.innings.overs.forEach(over => {
      over.bowls.forEach(bowl => {
        scores[bowl.playedBy].bowls++;

        if (bowl.isWicket) {
          scores[bowl.playedBy].out = bowl.isWicket.kind;
        }
        if (bowl.singles) {
          scores[bowl.playedBy].runs += bowl.singles;
        }
        if (bowl.boundary.run && bowl.boundary.kind === 'regular') {
          scores[bowl.playedBy].runs += bowl.boundary.run;
        }
      });
    });

    return scores;
  }
}

ScoreModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  innings: PropTypes.object,
  battingTeamPlayers: PropTypes.arrayOf(PropTypes.object),
  battingTeamName: PropTypes.string,
  bowlingTeamPlayers: PropTypes.arrayOf(PropTypes.object),
  bowlingTeamName: PropTypes.string,
};

export default ScoreModal;
