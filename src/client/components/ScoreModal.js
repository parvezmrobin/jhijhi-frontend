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
    const {battingCard, bowlingCard} = this._calculateBattingScores();
    const battingRows = battingCard.map(entry => <tr key={entry.name}>
      <th scope="row">{toTitleCase(entry.name)}</th>
      <td>{entry.bowls ? entry.runs : null}</td>
      <td>{entry.bowls || 'Did not bat'}</td>
      <td className={entry.out && 'text-danger'}>
        {entry.out.kind && toTitleCase(entry.out.kind, ' ')}
        {entry.out.by && ` (${toTitleCase(entry.out.by)})`}
      </td>
    </tr>);

    const bowlingRows = Object.keys(bowlingCard).map(bowler => <tr key={bowler}>
      <th scope="row">{toTitleCase(bowler)}</th>
      <td>{bowlingCard[bowler].run}</td>
      <td>{bowlingCard[bowler].runRate}</td>
      <td className={bowlingCard[bowler].wicket && 'text-danger'}>
        {bowlingCard[bowler].wicket}
      </td>
    </tr>);

    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle} size="xl">
        <ModalHeader toggle={this.props.toggle} className="border-0" tag="h2">
          Scorecard
        </ModalHeader>
        <ModalBody>
          <div className="container-fluid">
            <div className="row">

              <div className="col">
                <h4>{this.props.battingTeamName}</h4>
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
                  {battingRows}
                  </tbody>
                </Table>
              </div>
              <div className="col">
                <h4>{this.props.bowlingTeamName}</h4>
                <Table>
                  <thead>
                  <tr>
                    <th>Name</th>
                    <th>Runs</th>
                    <th>Run Rate</th>
                    <th>Wicket</th>
                  </tr>
                  </thead>
                  <tbody>
                  {bowlingRows}
                  </tbody>
                </Table>
              </div>

            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }

  _calculateBattingScores() {
    const bowlingTeamPlayers = this.props.bowlingTeamPlayers;
    const battingCard = this.props.battingTeamPlayers.map(player => ({
      name: player.name,
      runs: 0,
      bowls: 0,
      out: {},
    }));

    const bowlingCard = {};

    this.props.innings.overs.forEach(over => {
      const bowlerName = bowlingTeamPlayers[over.bowledBy].name;
      if (!(bowlerName in bowlingCard)) {
        bowlingCard[bowlerName] = {
          run: 0,
          wicket: 0,
          overs: 0,
          bowls: 0,
        };
      }

      let validDeliveries = 0;
      over.bowls.forEach(bowl => {
        battingCard[bowl.playedBy].bowls++;

        if (bowl.isWicket) {
          bowlingCard[bowlerName].wicket++;
          if (bowl.isWicket.kind === 'run out') {
            battingCard[bowl.isWicket.player].out = { kind: bowl.isWicket.kind };
          }
          battingCard[bowl.playedBy].out = {
            kind: bowl.isWicket.kind,
            by: bowlingTeamPlayers[over.bowledBy].name,
          };
        }
        if (bowl.singles) {
          battingCard[bowl.playedBy].runs += bowl.singles;
          bowlingCard[bowlerName].run += bowl.singles;
        }
        if (bowl.boundary.run) {
          if (bowl.boundary.kind === 'regular') {
            battingCard[bowl.playedBy].runs += bowl.boundary.run;
          }
          bowlingCard[bowlerName].run += bowl.boundary.run;
        }

        if (bowl.by) {
          bowlingCard[bowlerName].run += bowl.by;
        }
        if (bowl.legBy) {
          bowlingCard[bowlerName].run += bowl.legBy;
        }

        if (bowl.isWide) {
          bowlingCard[bowlerName].run++;
        } else if (bowl.isNo) {
          bowlingCard[bowlerName].run++;
        } else {
          validDeliveries++;
        }
      });

      if (validDeliveries >= 6) {
        bowlingCard[bowlerName].overs++;
      } else {
        bowlingCard[bowlerName].bowls += validDeliveries;
      }
    });

    for (const bowler in bowlingCard) {
      const stat = bowlingCard[bowler];
      stat.runRate = (stat.run / (stat.overs * 6 + stat.bowls)) * 6;
    }

    return {battingCard, bowlingCard};
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
