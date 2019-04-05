/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';
import PreviousOver from './PreviousOver';

class PreviousOvers extends Component {
  bowler;
  onCrease;

  render() {
    return (
      <Fragment>
        <h4 className="mt-2 pt-1 text-center text-white">
          Previous Overs
        </h4>
        <ul className="list-group">
          {this.props.overs.map(
            (over, i) => {
              const props = {
                key: i,
                bowler: over.bowler,
                runs: over.runs,
                wickets: over.wickets,
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
