/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Over from './Over';

function Overs(props) {
  const { overs, bowlingTeam, onOverClick, activeIndex } = props;
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
              active: i === activeIndex,
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

Overs.propTypes = {
  overs: PropTypes.array.isRequired,
  bowlingTeam: PropTypes.array.isRequired,
  onOverClick: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
};


export default Overs;
