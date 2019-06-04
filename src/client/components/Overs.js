/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import Over from './Over';

function Overs(props) {
  const { overs, bowlingTeam, onOverClick } = props;
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
              bowlerName: bowlingTeam[over.bowledBy].name,
              over,
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
