/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import FormGroup from '../components/form/FormGroup';


class Home extends Component {

  render() {
    const matches = [
      'Choose Match',
      ...Array(5)
        .fill(0)
        .map((v, i) => `Match ${i + 1}`)];
    return (
      <CenterContent col="col-md-6 col-lg-4">
        <FormGroup type="select" label={<h5 className="text-right mr-n3">Start</h5>}
                   options={matches}/>
      </CenterContent>
    );
  }

}

export default Home;
