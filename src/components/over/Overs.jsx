/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */

import React from 'react';
import PropTypes, { shape } from 'prop-types';

import Over from './Over';
import { OverType, PlayerType } from '../../types';

function Overs(props) {
  const { overs, bowlingTeam, onOverClick, activeIndex } = props;
  return (
    <>
      <h4 className="mt-2 pt-1 text-center text-white">
        {!!overs.length && 'Overs'}
      </h4>
      <ul className="list-group clickable">
        {overs.map((over, i) => {
          const _props = {
            key: i,
            overNo: i + 1,
            active: i === activeIndex,
            bowlerName: bowlingTeam[over.bowledBy].name,
            over,
            onOverClick,
          };
          // eslint-disable-next-line react/jsx-props-no-spreading
          return <Over {..._props} />;
        })}
      </ul>
    </>
  );
}

Overs.propTypes = {
  overs: PropTypes.arrayOf(shape(OverType)).isRequired,
  bowlingTeam: PropTypes.arrayOf(shape(PlayerType)).isRequired,
  onOverClick: PropTypes.func.isRequired,
  activeIndex: PropTypes.number,
};

export default Overs;
