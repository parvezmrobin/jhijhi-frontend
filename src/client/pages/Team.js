/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import TeamForm from '../components/TeamForm';


class Team extends Component {

  render() {
    const generatePlayerName = (n, i) => {
      return `${(Math.random() > .5) ? 'Random ' : ''}Player${(Math.random() > .5) ? ' Name' : ''} ${i + 1}`;
    };
    return (
      <div className="container-fluid px-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Teams"
                itemClass="text-white"
                list={new Array(5).fill(0).map((n, i) => `Team ${i + 1}`)}/>
            </CenterContent>
          </aside>
          <main className="col-md-6">
            <CenterContent col="col mt-5">
              <TeamForm
                players={Array(20).fill(0).map(generatePlayerName)}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Team;
