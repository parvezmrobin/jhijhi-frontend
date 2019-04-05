/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';


class Home extends Component {

  render() {
    const matches = [
      'Choose Match',
      ...Array(5)
        .fill(0)
        .map((v, i) => `Match ${i + 1}`)];
    const props = {
      id: "select-match",
      name: this.props.name,
      onChange: this.props.onChange,
    };
    const options = matches.map(option => <option key={option} value={option}>{option}</option>);

    return (
      <CenterContent col="col-md-6 col-lg-4 col-xl-3">
        <div className="form-group row">
          <div className="col">
            <select className="form-control border-0" {...props}>{options}</select>
          </div>
        </div>
      </CenterContent>
    );
  }

}

export default Home;
