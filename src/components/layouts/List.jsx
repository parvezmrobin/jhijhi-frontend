/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import PropTypes from 'prop-types';
import InputControl from '../form/control/InputControl';
import { Collapse, Button } from "reactstrap";
import { isMobile } from "../../lib/utils";
import * as feather from "feather-icons";

class List extends React.Component {
  state = {
    isOpen: !isMobile, // in mobile view, keep the list collapsed by default
  };

  toggle = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    feather.replace();
  }

  render() {
    const className = `list-group-item bg-transparent ${this.props.itemClass || ''}`;
    const mapper = this.props.itemMapper || (item => item);
    const items = this.props.list.map(
      (item, i) => <li key={item._id} className={className}>{mapper(item, i)}</li>,
    );
    const { isOpen } = this.state;
    return (
      <>
        <h3 className="d-flex justify-content-between">
          <span>{this.props.title}</span>
          <Button onClick={this.toggle} color="primary" className="d-sm-none"
                  key={isOpen}>
            {isOpen ? 'Collapse' : 'Expand'}
            <i data-feather={`chevron-${isOpen ? 'up' : 'down'}`}/>
          </Button>
        </h3>
        <Collapse isOpen={isOpen}>
          {this.props.onFilter
          && <InputControl autoFocus placeholder="Type here to filter list"
                           onChange={e => this.props.onFilter(e.target.value)}/>}
          <hr/>
          <ul className="list-group">{items}</ul>
        </Collapse>
      </>
    );
  }
}

List.propTypes = {
  title: PropTypes.string.isRequired,
  itemClass: PropTypes.string,
  itemMapper: PropTypes.func,
  list: PropTypes.array.isRequired,
  onFilter: PropTypes.func,
};


export default List;
