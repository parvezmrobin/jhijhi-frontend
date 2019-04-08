/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';


class SidebarList extends Component {
  itemClass;
  itemMapper;

  render() {
    const className = "list-group-item bg-transparent " + (this.props.itemClass || "");
    const mapper = this.props.itemMapper || (item => item);
    const items = this.props.list.map(((item, i) => <li key={item._id} className={className}>{mapper(item, i)}</li>));
    return (
      <Fragment>
        <h3 className="text-center text-info mt-10 mt-md-0">{this.props.title}</h3>
        <hr/>
        <ul className="list-group">{items}</ul>
      </Fragment>
    );
  }

}

export default SidebarList;
