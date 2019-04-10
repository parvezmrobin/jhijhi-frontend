/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 01, 2019
 */


import React, {Component} from 'react';
import fetcher from "../lib/fetcher";


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: [],
    };
  }

  componentDidMount() {
    document.getElementsByTagName('body')[0].classList.add('home');

    fetcher
      .get('matches')
      .then(response => {
        this.setState({matches: [{_id: '', name: 'Select Match'}].concat(response.data)})
      });
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].classList.remove('home');
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
      <div className="d-flex align-items-center vh-100">
        <div className="col-12 bg-dark rounded">
          <div className="d-flex justify-content-center vw-100">
            <div className="col-auto">
              <select className="form-control bg-dark border-0" style={{fontSize: "2rem"}} {...props}>{options}</select>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default Home;
