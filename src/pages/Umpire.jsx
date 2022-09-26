/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import UmpireForm from '../components/umpire/UmpireForm';
import { bindMethods, formatValidationFeedback } from '../lib/utils';
import fetcher from '../lib/fetcher';
import ErrorModal from '../components/modal/ErrorModal';
import UmpireSidebar from '../components/umpire/UmpireSidebar';
import Notification from '../components/Notification';
import { Location, MatchParamId } from '../types';

class Umpire extends Component {
  handlers = {
    onSubmit() {
      const { umpire } = this.state;
      let submission;
      if (umpire._id) {
        submission = this._updateUmpire();
      } else {
        submission = this._createUmpire();
      }

      submission
        .catch((err) => {
          const {
            isValid,
            feedback,
          } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },

    onChange(newValues) {
      this.setState((prevState) => ({ umpire: { ...prevState.umpire, ...newValues } }));
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      umpires: [],
      umpire: {
        name: '',
      },
      isValid: {
        name: null,
      },
      feedback: {
        name: null,
      },
      message: null,
      showErrorModal: false,
    };

    bindMethods(this);
  }

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen((location) => {
      const umpireId = location.pathname.substring(8);
      this._loadUmpireIfNecessary(umpireId);
    });

    this._loadUmpires();
  }

  componentWillUnmount() {
    this.unlisten(); // unlisten to route change events
    fetcher.cancelAll();
  }

  _loadUmpires = (keyword = '') => {
    const { match } = this.props;
    fetcher.get(`umpires?search=${keyword}`)
      .then((response) => {
        if (match.params.id) {
          this._loadUmpire(response.data, match.params.id);
        }
        return this.setState({ umpires: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  /**
   * Called when route is changed.
   * Loads `umpire` state if `umpireId` is truthy for editing purpose.
   * @param umpireId
   * @private
   */
  _loadUmpireIfNecessary(umpireId) {
    const { umpires } = this.state;
    if (umpires.length && umpireId) {
      this._loadUmpire(umpires, umpireId);
    } else {
      this.setState({ umpire: { name: '' } });
    }
  }

  _loadUmpire(umpires, umpireId) {
    const umpire = umpires.find((_umpire) => _umpire._id === umpireId);

    if (umpire) {
      this.setState({ umpire });
    }
  }

  _createUmpire() {
    const { umpire } = this.state;

    return fetcher
      .post('umpires', { ...umpire })
      .then((response) => this.setState((prevState) => ({
        ...prevState,
        umpires: prevState.umpires.concat(response.data.umpire),
        umpire: { name: '' },
        isValid: { name: null },
        feedback: { name: null },
        message: response.data.message,
      })));
  }

  _updateUmpire() {
    const { umpire } = this.state;
    const postData = { name: umpire.name };

    return fetcher
      .put(`umpires/${umpire._id}`, postData)
      .then((response) => this.setState((prevState) => {
        const umpires = [...prevState.umpires];
        const umpireIndex = umpires.findIndex((_umpire) => _umpire._id === umpire._id);
        if (umpireIndex !== -1) {
          umpires[umpireIndex] = response.data.umpire;
        }

        return {
          ...prevState,
          umpires,
          isValid: { name: null },
          feedback: { name: null },
          message: response.data.message,
        };
      }));
  }


  render() {
    const { match } = this.props;
    const umpireId = match.params.id;
    const {
      umpire, umpires, isValid, feedback, message, showErrorModal,
    } = this.state;
    return (
      <div className="container-fluid px-0">
        <Notification
          message={message}
          toggle={() => this.setState({ message: null })}
        />

        <div className="row">
          <UmpireSidebar
            editable
            umpireId={umpireId}
            umpires={umpires}
            onFilter={this._loadUmpires}
          />
          <main className="col pt-3 pt-sm-0">
            <CenterContent col="col-lg-8 col-md-10">
              <UmpireForm
                values={umpire}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
                isValid={isValid}
                feedback={feedback}
              />
            </CenterContent>
          </main>
        </div>
        <ErrorModal
          isOpen={showErrorModal}
          close={() => this.setState({ showErrorModal: false })}
        />
      </div>
    );
  }
}

Umpire.propTypes = {
  ...Location,
  match: MatchParamId,
};

export default Umpire;
