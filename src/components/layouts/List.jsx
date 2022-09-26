/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Button } from 'reactstrap';
import * as feather from 'feather-icons';
import InputControl from '../form/control/InputControl';
import { isMobile } from '../../lib/utils';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: !isMobile, // in mobile view, keep the list collapsed by default
    };
  }

  componentDidMount() {
    feather.replace();
  }

  componentDidUpdate() {
    feather.replace();
  }

  toggle = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const {
      title, list, itemClass, itemMapper, onFilter,
    } = this.props;
    const className = `list-group-item bg-transparent ${itemClass || ''}`;
    const mapper = itemMapper || ((item) => item);
    const items = list.map(
      (item, i) => <li key={item._id} className={className}>{mapper(item, i)}</li>,
    );
    const { isOpen } = this.state;
    return (
      <>
        <h3 className="d-flex justify-content-between">
          <span>{title}</span>
          <Button
            onClick={this.toggle}
            color="primary"
            className="d-sm-none"
            key={isOpen}
          >
            {isOpen ? 'Collapse' : 'Expand'}
            <i data-feather={`chevron-${isOpen ? 'up' : 'down'}`} />
          </Button>
        </h3>
        <Collapse isOpen={isOpen}>
          {onFilter
          && (
          <InputControl
            autoFocus
            placeholder="Type here to filter list"
            onChange={(e) => onFilter(e.target.value)}
          />
          )}
          <hr />
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
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  onFilter: PropTypes.func,
};


export default List;
