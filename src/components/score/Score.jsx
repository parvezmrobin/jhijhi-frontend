import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import { InningsType } from '../../types';

export default class Score extends Component {
  /**
   * @param {Number} fromOver
   * @param {Number} fromBowl
   * @param {Number} toOver
   * @param {Number} toBowl
   * @returns {{over: Number, bowl: Number}}
   * @private
   */
  static _subtractOver(fromOver, fromBowl, toOver, toBowl) {
    /* eslint-disable no-param-reassign */
    if (fromBowl < toBowl) {
      fromOver--;
      fromBowl += 6;
    }
    return {
      over: fromOver - toOver,
      bowl: fromBowl - toBowl,
    };
  }

  /**
   * @param {Number} overs
   * @param {Number} bowls
   * @param {Number} run
   * @param {Number} round
   * @returns {string}
   * @private
   */
  static _calcRunRate(overs, bowls, run, round) {
    const runRate = (run / (overs * 6 + bowls)) * 6;
    if (Number.isNaN(runRate)) {
      return 'N/A';
    }
    return round ? runRate.toFixed(round) : runRate.toString();
  }

  componentDidUpdate() {
    const { innings, inningsNo, firstInnings, onWinning } = this.props;
    if (inningsNo === 1) {
      return;
    }
    const { totalRun: firstInningsRuns } = Score.getTotalScore(firstInnings);
    const { totalRun: secondInningsRuns } = Score.getTotalScore(innings);
    if (secondInningsRuns > firstInningsRuns) {
      onWinning();
    }
  }

  static getOverCount(innings) {
    let numOvers = innings.overs.length - 1;
    let numBowls =
      innings.overs.length &&
      innings.overs[innings.overs.length - 1].bowls.reduce(
        (numValidBowls, bowl) => {
          if (!bowl.isWide && !bowl.isNo) {
            return numValidBowls + 1;
          }
          return numValidBowls;
        },
        0
      );

    if (numBowls === 6) {
      numOvers++;
      numBowls = null;
    }
    return {
      numOvers,
      numBowls,
    };
  }

  static getTotalScore(innings) {
    let totalWicket = 0;
    let totalRun = 0;
    for (const over of innings.overs) {
      for (const bowl of over.bowls) {
        if (bowl.isWicket) {
          totalWicket++;
        }
        if (bowl.singles) {
          totalRun += bowl.singles;
        }
        if (bowl.by) {
          totalRun += bowl.by;
        }
        if (bowl.legBy) {
          totalRun += bowl.legBy;
        }
        if (bowl.boundary?.run) {
          totalRun += bowl.boundary.run;
        }
        if (bowl.isWide || bowl.isNo) {
          totalRun++;
        }
      }
    }
    return {
      totalWicket,
      totalRun,
    };
  }

  render() {
    const {
      battingTeamName,
      tossOwner,
      choice,
      innings,
      inningsNo,
      numberOfOvers,
      firstInnings,
      singleBatsman,
    } = this.props;
    const { totalRun, totalWicket } = Score.getTotalScore(innings);

    const { numOvers, numBowls } = Score.getOverCount(innings);

    let inningsText;
    let runRateText = (
      <span>
        Run Rate:{' '}
        {Score._calcRunRate(
          numOvers,
          Number.parseInt(numBowls, 10),
          totalRun,
          2
        )}
      </span>
    );

    if (inningsNo === 1) {
      inningsText = 'Innings 1';
    } else {
      const { totalRun: targetRun } = Score.getTotalScore(firstInnings);
      const { over: remainingOvers, bowl: remainingBowls } =
        Score._subtractOver(numberOfOvers, 0, numOvers, numBowls);

      const remainingRuns = targetRun - totalRun + 1;
      const remainingOverText =
        `${remainingRuns} in ` +
        `${
          remainingOvers
            ? `${remainingOvers} over${remainingOvers > 1 ? 's' : ''}`
            : ''
        } ` +
        `${
          remainingBowls
            ? `${remainingBowls} bowl${remainingBowls > 1 ? 's' : ''}`
            : ''
        }`;
      inningsText = (
        <span>
          <span>Target {targetRun + 1} </span>
          <small>({remainingOverText})</small>
        </span>
      );
      runRateText = (
        <p>
          {runRateText}
          <span className="float-right">
            Required:{' '}
            {Score._calcRunRate(
              remainingOvers,
              remainingBowls,
              remainingRuns,
              2
            )}
          </span>
        </p>
      );
    }

    return (
      <div>
        <div className="container-fluid text-success mt-5 rounded">
          <div className="p-2">
            <h4 className="mt-3 text-white">
              {battingTeamName} - {totalRun} / {totalWicket}
            </h4>
            <h5>
              <span className="text-info">
                {numOvers} over{numOvers > 1 && 's'}
                {(numBowls || null) && ` ${numBowls} bowl`}
                {numBowls > 1 && 's'}
              </span>
              &nbsp;
              <small className="font-weight-normal">
                ({numberOfOvers} overs)
              </small>
            </h5>
            <h5 className="font-weight-normal">{inningsText}</h5>
            {singleBatsman && <p>In single batsman mode</p>}
          </div>
        </div>
        <div className="container-fluid text-white">
          <div className="px-2">{runRateText}</div>
          <p className="px-2">
            <em>{tossOwner}</em> won the toss <br />
            and chose to <em>{choice}</em>.
          </p>
        </div>
      </div>
    );
  }
}

Score.propTypes = {
  battingTeamName: PropTypes.string,
  tossOwner: PropTypes.string,
  choice: PropTypes.string,
  innings: shape(InningsType),
  firstInnings: shape(InningsType),
  inningsNo: PropTypes.number,
  numberOfOvers: PropTypes.number,
  singleBatsman: PropTypes.bool,
  onWinning: PropTypes.func,
};
