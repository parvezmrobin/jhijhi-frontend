import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import fetcher from '../lib/fetcher';
import CenterContent from '../components/layouts/CenterContent';
import List from '../components/layouts/List';
import MatchDetail from '../components/MatchDetail';
import ErrorModal from '../components/modal/ErrorModal';
import { MatchParamId } from '../types';

class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      matches: null,
      showErrorModal: false,
    };
  }

  componentDidMount() {
    fetcher
      .get('/matches/done')
      .then((response) => this.setState({ matches: response.data }))
      .catch(() => this.setState({ showErrorModal: true }));
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  onFilter = (keyword) =>
    fetcher
      .get(`/matches/done?search=${keyword}`)
      .then((response) => this.setState({ matches: response.data }))
      .catch(() => this.setState({ showErrorModal: true }));

  sidebarItemMapper = (match) => {
    const { match: selectedMatch } = this.props;
    const selectedMatchId = selectedMatch.params.id;
    return (
      <Link
        className={
          match._id === selectedMatchId ? 'text-success' : 'text-white'
        }
        to={`history@${match._id}`}
      >
        {match.name}
      </Link>
    );
  };

  render() {
    const { match } = this.props;
    const matchId = match.params.id;
    const { matches, showErrorModal } = this.state;

    if (matches && !matches.length) {
      return (
        <CenterContent>
          <h2 className="text-center mt-10" style={{ fontFamily: 'cursive' }}>
            You want score before even playing a match!
          </h2>
          <div className="row justify-content-center">
            <img className="img-fluid" src="/frustrated.gif" alt="frustrated" />
          </div>
        </CenterContent>
      );
    }
    const sidebar = (
      <aside className="col-md-3">
        <CenterContent col="col">
          <List
            title="Completed Matches"
            itemMapper={this.sidebarItemMapper}
            list={matches || []}
            onFilter={debounce(this.onFilter, 500)}
          />
        </CenterContent>
      </aside>
    );

    return (
      <div className="row">
        {sidebar}
        <MatchDetail matchId={matchId} isPrivate />
        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />
      </div>
    );
  }
}

History.propTypes = {
  match: MatchParamId,
};

export default History;
