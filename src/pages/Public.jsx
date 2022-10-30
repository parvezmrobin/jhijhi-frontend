/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 23, 2019
 */

import React from 'react';
import MatchDetail from '../components/MatchDetail';
import { MatchParamId } from '../types';

function Public({ match }) {
  return (
    <div className="mx-n3">
      <MatchDetail matchId={match.params.id} />
    </div>
  );
}

Public.propTypes = {
  match: MatchParamId,
};

export default Public;
