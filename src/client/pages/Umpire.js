/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Mar 31, 2019
 */


import React, {Component} from 'react';
import CenterContent from '../components/layouts/CenterContent';
import SidebarList from '../components/SidebarList';
import UmpireForm from "../components/UmpireForm";


class Player extends Component {

  render() {
    return (
      <div className="container-fluid pl-0">
        <div className="row">
          <aside className="col-md-3">
            <CenterContent col="col">
              <SidebarList
                title="Existing Umpires"
                itemClass="text-white"
                list={new Array(5).fill(0).map((n, i) => `Umpire ${i+1}`)}/>
            </CenterContent>
          </aside>
          <main className="col">
            <CenterContent col="col-lg-8 col-md-10">
              <UmpireForm/>
            </CenterContent>
          </main>
        </div>
      </div>
    );
  }

}

export default Player;
