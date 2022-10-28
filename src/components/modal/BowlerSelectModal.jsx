import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import * as PropTypes from 'prop-types';
import { shape } from 'prop-types';
import FormGroup from '../form/FormGroup';
import { bindMethods, subtract } from '../../lib/utils';
import fetcher from '../../lib/fetcher';
import { PlayerType } from '../../types';

export default class BowlerSelectModal extends Component {
  handlers = {
    onSelect() {
      const { matchId, bowlers, onSelect } = this.props;
      const { bowler } = this.state;
      const bowlerIndex = bowlers.findIndex((b) => b._id === bowler);
      if (bowlerIndex === -1) {
        return this.setState({ error: 'Error while selecting the bowler' });
      }
      const data = { bowledBy: bowlerIndex };
      return fetcher
        .post(`matches/${matchId}/over`, data)
        .then(() => onSelect(bowlerIndex));
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      bowler: '',
      error: '',
    };
    bindMethods(this);
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const { bowlers, lastBowler } = nextProps;
    const availableBowlers = !lastBowler
      ? bowlers
      : subtract(bowlers, [lastBowler], (b1, b2) => b1._id === b2._id);
    this.setState({ bowler: availableBowlers[0]._id });
  }

  componentWillUnmount() {
    fetcher.cancelAll();
  }

  render() {
    const { open, bowlers, lastBowler } = this.props;
    const { bowler, error } = this.state;

    let availableBowlers;
    if (!lastBowler) {
      availableBowlers = bowlers;
    } else {
      availableBowlers = subtract(
        bowlers,
        [lastBowler],
        (b1, b2) => b1._id === b2._id
      );
    }

    return (
      <Modal isOpen={open} contentClassName="bg-dark">
        <ModalHeader className="text-primary">Select Bowler</ModalHeader>
        <ModalBody>
          <FormGroup
            type="select"
            name="bowler"
            value={bowler}
            onChange={(e) => this.setState({ bowler: e.target.value })}
            options={availableBowlers}
            isValid={error ? false : null}
            feedback={error}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.onSelect}>
            Select
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

BowlerSelectModal.propTypes = {
  open: PropTypes.bool,
  onSelect: PropTypes.func,
  bowlers: PropTypes.arrayOf(shape(PlayerType)),
  lastBowler: shape(PlayerType),
  matchId: PropTypes.string,
};
