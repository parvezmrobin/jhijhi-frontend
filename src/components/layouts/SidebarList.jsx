/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import InputControl from '../form/control/input';


function SidebarList(props) {
  const className = 'list-group-item bg-transparent ' + (props.itemClass || '');
  const mapper = props.itemMapper || (item => item);
  const items = props.list.map(
    (item, i) => <li key={item._id} className={className}>{mapper(item, i)}</li>,
  );
  return (
    <Fragment>
      <h3>{props.title}</h3>
      {props.onFilter && <InputControl autoFocus placeholder="Type here to filter list"
                                       onChange={e => props.onFilter(e.target.value)}/>}
      <hr/>
      <ul className="list-group">{items}</ul>
    </Fragment>
  );
}

SidebarList.propTypes = {
  title: PropTypes.string.isRequired,
  itemClass: PropTypes.string,
  itemMapper: PropTypes.func,
  list: PropTypes.array.isRequired,
  onFilter: PropTypes.func,
};


export default SidebarList;
