/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 23, 2019
 */


import React from 'react';
import MatchDetail from '../components/MatchDetail';

function Public(props) {
  return (
    <div className="mx-n3">
      <MatchDetail matchId={props.match.params.id}/>
    </div>
  );
}

export default Public;
