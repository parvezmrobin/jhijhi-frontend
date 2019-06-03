/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import Over from './Over';
import { optional } from '../lib/utils';

function Overs(props) {
  const { overs, bowlingTeam, onOverClick } = props;
  const getEvents = (over) => {
    return over.bowls.reduce((events, bowl) => {
      if (bowl.isWicket) {
        events.push('w');
      }
      if (optional(bowl.boundary).run) {
        events.push(String(bowl.boundary.run));
      }
      return events;
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
        Overs
      </h4>
      <ul className="list-group clickable">
        {overs.map(
          (over, i) => {
            const props = {
              key: i,
              overNo: i + 1,
              bowler: bowlingTeam[over.bowledBy].name,
              runs: getRuns(over),
              events: getEvents(over),
              onOverClick: onOverClick,
            };
            return (<Over {...props}/>);
          },
        )}
      </ul>
    </Fragment>
  );
}

export default Overs;
