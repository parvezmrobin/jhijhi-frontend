/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, { Component } from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';
import CheckBoxControl from "../components/form/control/checkbox";


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
                list={new Array(5).fill(0).map((n, i) => `Team ${i+1}`)}/>
            </CenterContent>
          </aside>
          <main className="col-md-6">
            <CenterContent col="col">
              <TeamForm/>
            </CenterContent>
          </main>
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Choose Players"
                itemClass="text-white"
                itemMapper={((item, i) => <CheckBoxControl name={`player${i}`}>{item}</CheckBoxControl>)}
                list={new Array(20).fill(0).map((n, i) => `Player ${i+1}`)}/>
            </CenterContent>
          </aside>
        </div>
      </div>
    );
  }

}

export default Team;
