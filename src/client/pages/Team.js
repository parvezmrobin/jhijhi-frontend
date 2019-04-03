/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';


class Team extends Component {

  render() {
    return (
      <div className="container-fluid pl-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Teams"
                itemClass="text-white"
                list={['abc', 'efg', 'hij', 'klm', 'nop']}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <TeamForm/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Team;
