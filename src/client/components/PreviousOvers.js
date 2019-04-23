/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';
import PreviousOver from './PreviousOver';

class PreviousOvers extends Component {

  render() {
    const { overs, bowlingTeam, onOverClick } = this.props;
    const getWickets = (over) => {
      return over.bowls.reduce((wickets, bowl) => {
        if (bowl.isWicket) {
          wickets.push(bowl.isWicket);
        }
        return wickets;
      }, []);
    };

    const getRuns = (over) => {
      return over.bowls.reduce((runs, bowl) => {
        if (bowl.singles) {
          runs += bowl.singles;
        }
        if (bowl.by) {
          runs += bowl.by;
        }
        if (bowl.legBy) {
          runs += bowl.legBy;
        }
        if (bowl.boundary.run) {
          runs += bowl.boundary.run;
        }
        if (bowl.isWide || bowl.isNo) {
          runs++;
        }

        return runs;
      }, 0);
    };
    return (
      <Fragment>
        <h4 className="mt-2 pt-1 text-center text-white">
          Previous Overs
        </h4>
        <ul className="list-group clickable">
          {overs.map(
            (over, i) => {
              const props = {
                key: i,
                overNo: i + 1,
                bowler: bowlingTeam[over.bowledBy].name,
                runs: getRuns(over),
                wickets: getWickets(over),
                onOverClick: onOverClick,
              };
              return (<PreviousOver {...props}/>);
            },
          )}
        </ul>
      </Fragment>
    );
  }

}

export default PreviousOvers;
