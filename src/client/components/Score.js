import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class Score extends Component {
  render() {
    const { battingTeamName, tossOwner, choice, innings, inningsNo, numberOfOvers, firstInnings } = this.props;
    const { totalRun, totalWicket } = Score._getTotalScore(innings);

    let numOvers = innings.overs.length - 1;
    let numBowls = innings.overs.length &&
      innings.overs[innings.overs.length - 1].bowls.reduce((numValidBowls, bowl) => {
        if (!bowl.isWide && !bowl.isNo) {
          return numValidBowls + 1;
        }
        return numValidBowls;
      }, 0);

    if (numBowls === 6) {
      numOvers++;
      numBowls = null;
    }

    let inningsText;
    if (inningsNo === 1) {
      inningsText = 'Innings 1';
    } else {
      const { totalRun: targetRun } = Score._getTotalScore(firstInnings);
      if (totalRun > targetRun) {
        return <Redirect to={`history@${this.props.matchId}`}/>;
      }
      const {over: remainingOvers, bowl: remainingBowls} = Score._subtractOver({over: numberOfOvers, bowl: 0}, {over: numOvers, bowl: numBowls});
      const remainingOverText = `in ${remainingOvers? remainingOvers + ' over' + ((remainingOvers > 1)? 's': ''): ''} `
       + `${remainingBowls? remainingBowls + ' bowl' + ((remainingBowls > 1)? 's': ''): ''}`;
      inningsText = <span>Target {targetRun + 1} <small>{remainingOverText}</small></span>;
    }

    return <>
      <div className='bg-dark text-info p-2 mt-5 rounded'>
        <h4 className="mt-3 text-white">{battingTeamName} - {totalRun} / {totalWicket}</h4>
        <h5>
          <span className="text-primary">{numOvers} overs {numBowls && `${numBowls} bowl${(numBowls > 1) ? 's' : ''}`}</span>
          &nbsp;<small>({numberOfOvers} overs)</small>
        </h5>
        <h5>{inningsText}</h5>

      </div>
      <div className="mt-2 text-white">
        <h5 className="px-2">
          <small>
            <em>{tossOwner}</em> won the toss <br/>
            and chose to <em>{choice}</em>.
          </small>
        </h5>

      </div>
    </>;
  }

  static _getTotalScore(innings) {
    let totalWicket = 0,
      totalRun = 0;
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
        if (bowl.boundary.run) {
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

  /**
   * @param {{over: Number, bowl: Number}} from
   * @param {{over: Number, bowl: Number}} to
   * @returns {{over: Number, bowl: Number}}
   * @private
   */
  static _subtractOver(from, to) {
    if (from.bowl < to.bowl) {
      from.over--;
      from.bowl += 6;
    }
    return {
      over: from.over - to.over,
      bowl: from.bowl - to.bowl,
    };
  };
}
