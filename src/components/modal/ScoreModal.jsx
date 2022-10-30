/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 24, 2019
 */

import React from 'react';
import PropTypes, { shape } from 'prop-types';
import { Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { toTitleCase } from '../../lib/utils';
import { InningsType, PlayerType } from '../../types';

const _calculateBattingScores = ({
  battingTeamPlayers,
  bowlingTeamPlayers,
  innings,
}) => {
  const battingCard = battingTeamPlayers.map((player) => ({
    name: player.name,
    runs: 0,
    bowls: 0,
    out: {},
  }));

  const bowlingCard = {};
  let totalRun = 0;
  let totalWicket = 0;
  innings.overs.forEach((over) => {
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
    over.bowls.forEach((bowl) => {
      battingCard[bowl.playedBy].bowls++;

      if (bowl.isWicket) {
        totalWicket++;
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
        totalRun += bowl.singles;
        battingCard[bowl.playedBy].runs += bowl.singles;
        bowlingCard[bowlerName].run += bowl.singles;
      }
      if (bowl.boundary?.run) {
        if (bowl.boundary.kind === 'regular') {
          battingCard[bowl.playedBy].runs += bowl.boundary.run;
        }
        totalRun += bowl.boundary.run;
        bowlingCard[bowlerName].run += bowl.boundary.run;
      }

      if (bowl.by) {
        totalRun += bowl.by;
        bowlingCard[bowlerName].run += bowl.by;
      }
      if (bowl.legBy) {
        totalRun += bowl.legBy;
        bowlingCard[bowlerName].run += bowl.legBy;
      }

      if (bowl.isWide) {
        totalRun++;
        bowlingCard[bowlerName].run++;
      } else if (bowl.isNo) {
        totalRun++;
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
    if (bowler in bowlingCard) {
      const stat = bowlingCard[bowler];
      stat.runRate = ((stat.run / (stat.overs * 6 + stat.bowls)) * 6).toFixed(
        2
      );
    }
  }

  return {
    battingCard,
    bowlingCard,
    totalRun,
    totalWicket,
  };
};

function ScoreModal({
  battingTeamName,
  bowlingTeamName,
  isOpen,
  toggle,
  battingTeamPlayers,
  bowlingTeamPlayers,
  innings,
}) {
  const { battingCard, bowlingCard, totalRun, totalWicket } =
    _calculateBattingScores({
      battingTeamPlayers,
      bowlingTeamPlayers,
      innings,
    });

  const getColSpan = (entry) => {
    if (entry.bowls) {
      return 1;
    }
    return entry.out.kind ? 2 : 3;
  };

  const battingRows = battingCard.map((entry) => (
    <tr key={entry.name}>
      <th scope="row">{toTitleCase(entry.name)}</th>
      {(entry.bowls || null) && <td>{entry.runs}</td>}
      <td
        className={!entry.bowls ? 'text-center' : ''}
        colSpan={getColSpan(entry)}
      >
        {entry.bowls || 'Did not bat'}
      </td>
      {(entry.out.kind || entry.bowls || null) && (
        <td
          className={
            entry.out.kind ? 'text-danger font-weight-bold' : 'text-success'
          }
        >
          {entry.out.kind && toTitleCase(entry.out.kind, ' ')}
          {entry.out.by && ` (${toTitleCase(entry.out.by)})`}
          {!entry.out.kind && entry.bowls ? 'Not Out' : null}
        </td>
      )}
    </tr>
  ));

  const bowlingRows = Object.keys(bowlingCard).map((bowler) => (
    <tr key={bowler}>
      <th scope="row">{toTitleCase(bowler)}</th>
      <td>
        {bowlingCard[bowler].overs}
        {bowlingCard[bowler].bowls ? `.${bowlingCard[bowler].bowls}` : ''}
      </td>
      <td>{bowlingCard[bowler].run}</td>
      <td>{bowlingCard[bowler].runRate}</td>
      <td
        className={bowlingCard[bowler].wicket && 'text-danger font-weight-bold'}
      >
        {bowlingCard[bowler].wicket}
      </td>
    </tr>
  ));

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl" contentClassName="bg-dark">
      <ModalHeader
        toggle={toggle}
        className="border-0 text-success ml-3"
        tag="h2"
      >
        Scorecard
      </ModalHeader>
      <ModalBody>
        <div className="container-fluid">
          <div className="row">
            <div className="col">
              <h4 className="text-primary">{`${battingTeamName} (${totalRun}/${totalWicket})`}</h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="text-right">Name</th>
                    <th>Runs</th>
                    <th>Bowls</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>{battingRows}</tbody>
              </Table>
            </div>
            <div className="col">
              <h4 className="text-primary">{bowlingTeamName}</h4>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="text-right">Name</th>
                    <th>Overs</th>
                    <th>Runs</th>
                    <th>Run Rate</th>
                    <th>Wicket</th>
                  </tr>
                </thead>
                <tbody>{bowlingRows}</tbody>
              </Table>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="d-md-none">
        <button
          type="button"
          className="btn btn-secondary float-right"
          onClick={toggle}
        >
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
}

ScoreModal.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  innings: shape(InningsType),
  battingTeamPlayers: PropTypes.arrayOf(shape(PlayerType)),
  battingTeamName: PropTypes.string,
  bowlingTeamPlayers: PropTypes.arrayOf(shape(PlayerType)),
  bowlingTeamName: PropTypes.string,
};

export default ScoreModal;
