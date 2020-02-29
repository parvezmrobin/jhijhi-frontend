/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React from 'react';
import PropTypes from 'prop-types';
import InputControl from '../form/control/input';
import { Collapse, Button } from "reactstrap";


class List extends React.Component {
  state = {
    isOpen: window.innerWidth > Number.parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-sm')
    ), // in mobile view keep the list collapsed by default
  };

  toggle = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const className = 'list-group-item bg-transparent ' + (this.props.itemClass || '');
    const mapper = this.props.itemMapper || (item => item);
    const items = this.props.list.map(
      (item, i) => <li key={item._id} className={className}>{mapper(item, i)}</li>,
    );
    return (
      <>
        <h3>
          {this.props.title}
          <Button onClick={this.toggle} color="primary" className="float-right d-sm-none">
            {this.state.isOpen ? 'Collapse' : 'Expand'}
          </Button>
        </h3>
        <Collapse isOpen={this.state.isOpen}>
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
