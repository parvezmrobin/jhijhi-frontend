import React, { Component } from 'react';

export default class Score extends Component {
  render() {
    const { battingTeamName, tossOwner, choice, innings, inningsNo, numberOfOvers, firstInnings } = this.props;
    const {totalRun, totalWicket} = Score._getTotalScore(innings);

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

    return <>
      <div className='bg-dark text-info p-2 mt-5 rounded'>
        <h4 className="mt-3 text-white">{battingTeamName} - {totalRun} / {totalWicket}</h4>
        <h5 className="text-primary">
          <small>After</small>
          &nbsp;{numOvers} overs {numBowls && `${numBowls} bowl${(numBowls > 1) ? 's' : ''}`}
        </h5>
        <h5>
          <small>From</small>&nbsp;{numberOfOvers} overs
        </h5>
        <h6>
          {(inningsNo === 1) && `Innings ${inningsNo}`}
          {(inningsNo !== 1) && `Target ${Score._getTotalScore(firstInnings)}`}
        </h6>

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
    let totalWicket = 0, totalRun = 0;
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
}
