/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 04, 2019
 */


import React, { Component, Fragment } from 'react';


class SidebarList extends Component {
  itemClass;

  render() {
    const className = "list-group-item bg-transparent " + (this.props.itemClass || "");

    const items = this.props.list.map(
      item => <li key={item} className={className}>{item}</li>,
    );
    return (
      <Fragment>
        <h3 className="text-center text-info">{this.props.title}</h3>
        <hr/>
        <ul className="list-group">{items}</ul>
      </Fragment>
    );
  }

}

export default SidebarList;
