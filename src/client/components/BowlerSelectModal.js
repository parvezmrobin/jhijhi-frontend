import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import FormGroup from './form/FormGroup';
import * as PropTypes from 'prop-types';
import { bindMethods, subtract } from '../lib/utils';
import fetcher from '../lib/fetcher';

export default class BowlerSelectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bowler: '',
      error: '',
    };
    bindMethods(this);
  }

  handlers = {
    onSelect() {
      const bowlerIndex = this.props.bowlers.findIndex(b => b._id === this.state.bowler);
      if (bowlerIndex === -1) {
        return this.setState({ error: 'Error while selecting the bowler' });
      }
      const data = { bowledBy: bowlerIndex };
      fetcher
        .post(`matches/${this.props.matchId}/over`, data)
        .then(() => this.props.onSelect(bowlerIndex));
    },
  };


  componentWillReceiveProps(nextProps) {
    const { bowlers, lastBowler } = nextProps;
    const availableBowlers = (!lastBowler) ? bowlers
      : subtract(bowlers, [lastBowler], (b1, b2) => b1._id === b2._id);
    this.setState({ bowler: availableBowlers[0]._id });
  }


  render() {
    const { open, bowlers, lastBowler } = this.props;

    const availableBowlers = (!lastBowler) ? bowlers
      : subtract(bowlers, [lastBowler], (b1, b2) => b1._id === b2._id);

    return <Modal isOpen={open}>
      <ModalHeader className="text-primary">
        Select Bowler
      </ModalHeader>
      <ModalBody>
        <FormGroup type="select" name="bowler" value={this.state.bowler}
                   onChange={e => this.setState({ bowler: e.target.value })}
                   options={availableBowlers} isValid={this.state.error ? false : null}
                   feedback={this.state.error}/>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={this.onSelect}>Select</Button>
      </ModalFooter>
    </Modal>;
  }
}

BowlerSelectModal.propTypes = {
  open: PropTypes.bool,
  onSelect: PropTypes.func,
  bowlers: PropTypes.array,
  lastBowler: PropTypes.object,
  matchId: PropTypes.string,
};
