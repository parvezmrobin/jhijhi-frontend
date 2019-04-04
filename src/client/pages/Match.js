/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import MatchForm from "../components/MatchForm";


class Match extends Component {

  render() {
    const teams = new Array(5).fill(0).map((n, i) => `Team ${i + 1}`);
    const umpires = ["None", ...new Array(5).fill(0).map((n, i) => `Umpire ${i + 1}`)];
    return (
      <div className="container-fluid pl-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Upcoming Matches"
                itemClass="text-white"
                list={new Array(10).fill(0).map((n, i) => `Upcoming Match ${i + 1}`)}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <MatchForm teams={teams}
                         umpires={umpires}/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Match;
