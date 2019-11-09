/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import UmpireForm from "../components/umpire/UmpireForm";
import { bindMethods, formatValidationFeedback } from "../lib/utils";
import fetcher from "../lib/fetcher";
import ErrorModal from "../components/modal/ErrorModal";
import UmpireSidebar from "../components/umpire/UmpireSidebar";
import Notification from "../components/Notification";

class Umpire extends Component {
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
    this.unlisten = this.props.history.listen((location) => {
      const umpireId = location.pathname.substr(8);
      this._loadUmpireIfNecessary(umpireId);
    });

    this._loadUmpires();
  }

  _loadUmpires = (keyword = '') => {
    fetcher.get(`umpires?search=${keyword}`)
      .then(response => {
        if (this.props.match.params.id) {
          this._loadUmpire(response.data, this.props.match.params.id);
        }
        return this.setState({ umpires: response.data });
      })
      .catch(() => this.setState({ showErrorModal: true }));
  };

  componentWillUnmount() {
    this.unlisten(); // unlisten to route change events
    fetcher.cancelAll();
  }

  /**
   * Called when route is changed.
   * Loads `umpire` state if `umpireId` is truthy for editing purpose.
   * @param umpireId
   * @private
   */
  _loadUmpireIfNecessary(umpireId) {
    const umpires = this.state.umpires;
    if (umpires.length && umpireId) {
      this._loadUmpire(umpires, umpireId);
    } else {
      this.setState({ umpire: { name: '' } });
    }
  }

  _loadUmpire(umpires, umpireId) {
    const umpire = umpires.find(_umpire => _umpire._id === umpireId);

    if (umpire) {
      this.setState({ umpire });
    }
  }

  _createUmpire() {
    const postData = { ...this.state.umpire };

    return fetcher
      .post('umpires', postData)
      .then(response => this.setState(prevState => ({
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
      .then(response => {
        return this.setState(prevState => {
          const umpireIndex = prevState.umpires.findIndex(_umpire => _umpire._id === umpire._id);
          if (umpireIndex !== -1) {
            prevState.umpires[umpireIndex] = response.data.umpire;
          }

          return {
            ...prevState,
            isValid: { name: null },
            feedback: { name: null },
            message: response.data.message,
          };
        });
      });
  }

  handlers = {
    onSubmit() {
      let submission;
      if (this.state.umpire._id) {
        submission = this._updateUmpire();
      } else {
        submission = this._createUmpire();
      }

      submission
        .catch(err => {
          const { isValid, feedback } = formatValidationFeedback(err);

          this.setState({
            isValid,
            feedback,
          });
        })
        .catch(() => this.setState({ showErrorModal: true }));
    },

    onChange(newValues) {
      this.setState(prevState => ({ umpire: { ...prevState.umpire, ...newValues } }));
    },
  };

  render() {
    const umpireId = this.props.match.params.id;
    return (
      <div className="container-fluid px-0">
        <Notification message={this.state.message} toggle={() => this.setState({ message: null })}/>

        <div className="row">
          <UmpireSidebar editable umpireId={umpireId} umpires={this.state.umpires}
                         onFilter={this._loadUmpires}/>
          <main className="col pt-3 pt-sm-0">
            <CenterContent col="col-lg-8 col-md-10">
              <UmpireForm values={this.state.umpire} onChange={this.onChange}
                          onSubmit={this.onSubmit}
                          isValid={this.state.isValid} feedback={this.state.feedback}/>
            </CenterContent>
          </main>
        </div>
        <ErrorModal isOpen={this.state.showErrorModal} close={() => this.setState({ showErrorModal: false })}/>
      </div>
    );
  }

}

export default Umpire;
