import SidebarList from './SidebarList';
import CenterContent from './layouts/CenterContent';
import React from 'react';
import { toTitleCase } from '../lib/utils';

function _genSidebarPlayerMapper(innings, battingTeamPlayers) {
  const sidebarContent = {};
  for (const over of innings.overs) {
    for (const bowl of over.bowls) {
      const batsmanName = battingTeamPlayers[bowl.playedBy].name;
      if (!sidebarContent[batsmanName]) {
        sidebarContent[batsmanName] = {
          run: 0,
          isOut: null,
        };
      }
      const runOutBatsmanName = bowl.isWicket && Number.isInteger(bowl.isWicket.player) && battingTeamPlayers[bowl.isWicket.player].name;
      if (runOutBatsmanName && !sidebarContent[runOutBatsmanName]) {
        sidebarContent[runOutBatsmanName] = {
          run: 0,
          isOut: null,
        };
      }

      if (bowl.singles) {
        sidebarContent[batsmanName].run += bowl.singles;
      } else if (bowl.boundary.run && bowl.boundary.kind === 'regular') {
        sidebarContent[batsmanName].run += bowl.boundary.run;
      }
      if (bowl.isWicket) {
        const outBatsmanName = bowl.isWicket.player ? battingTeamPlayers[bowl.isWicket.player].name : batsmanName;
        sidebarContent[outBatsmanName].isOut = bowl.isWicket.kind;
      }
    }
  }

  const _sidebarPlayerMapper = ({name}) => {
    if (!sidebarContent[name]) {
      return toTitleCase(name, ' ');
    }

    const isOut = sidebarContent[name].isOut;
    const className = isOut ? 'text-secondary' : 'text-primary';
    const status = isOut ? toTitleCase(isOut, ' ') : 'Playing';
    return <span className={className}>
        {toTitleCase(name, ' ')} ({sidebarContent[name].run}) - {status}
      </span>;
  };
  return _sidebarPlayerMapper;
}

export default function ScoreCard(props) {
  const {innings, battingTeamName, battingTeamPlayers} = props;
  const sidebarPlayerMapper = _genSidebarPlayerMapper(innings, battingTeamPlayers);

  const sidebarPlayerList = battingTeamPlayers
    .map(({_id, name}) => ({
      _id,
      name,
    }));

  return <CenterContent col="col">
    <SidebarList title={battingTeamName} itemClass="text-white"
                 itemMapper={sidebarPlayerMapper} list={sidebarPlayerList}/>
  </CenterContent>
}
