/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import fetcher from "../lib/fetcher";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    fetcher
      .get('matches')
      .then(response => {
        this.setState({matches: [{_id: '', name: 'Select Match'}].concat(response.data)})
      });
  }


  render() {
    const props = {
      id: "select-match",
      name: this.props.name,
      onChange: this.props.onChange,
    };
    const options = this.state.matches.map((match, i) => {
      const style = {fontSize: "1.5rem"};
      if (i === 0) {
        style.display = "none";
      }
      return <option key={match._id} value={match._id} style={style}>{match.name}</option>;
      });

    return (
      <CenterContent col="col-auto">
        <select className="form-control border-0" style={{fontSize: "2rem"}} {...props}>{options}</select>
      </CenterContent>
    );
  }

}

export default Home;
