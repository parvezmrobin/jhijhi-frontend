import PropTypes, {
  arrayOf, bool, number, shape, string,
} from 'prop-types';

function makeTypeMaker(type) {
  return function makeType(baseType) {
    const keyValues = Object.entries(baseType)
      .filter(([field]) => field !== '_id');
    return Object.fromEntries(
      keyValues.map(([field]) => [field, type]),
    );
  };
}

export const makeIsValidType = makeTypeMaker(bool);
export const makeFeedbackType = makeTypeMaker(string);

export const Location = {
  location: shape({
    search: string.isRequired,
  }).isRequired,
};

export const Player = {
  _id: string.isRequired,
  name: string.isRequired,
  jerseyNo: number.isRequired,
};

export const Team = {
  _id: string,
  name: string.isRequired,
  shortName: string.isRequired,
};

export const Umpire = {
  _id: string.isRequired,
  name: string.isRequired,
};

const Bowl = {
  playedBy: number.isRequired,
  isWicket: shape({
    kind: string.isRequired,
    player: number.isRequired,
  }),
  singles: number,
  by: number,
  legBy: number,
  boundary: shape({
    run: number.isRequired,
    kind: string.isRequired,
  }),
  isWide: bool.isRequired,
  isNo: string.isRequired,
};

const Over = {
  bowledBy: number.isRequired,
  bowls: arrayOf(shape(Bowl)),
};

const Innings = {
  overs: arrayOf(shape(Over)),
};

export const Match = {
  _id: string.isRequired,
  name: string.isRequired,
  overs: number.isRequired,
  team1: shape(Team).isRequired,
  team2: shape(Team).isRequired,
  umpire1: shape(Umpire),
  umpire2: shape(Umpire),
  umpire3: shape(Umpire),
  team1Players: arrayOf(shape(Player)).isRequired,
  team2Players: arrayOf(shape(Player)).isRequired,
  team1Captain: shape(Player).isRequired,
  team2Captain: shape(Player).isRequired,
  team1WonToss: bool.isRequired,
  team1BatFirst: bool.isRequired,
  state: string.isRequired,
  innings1: shape(Innings),
  innings2: shape(Innings),
};
export const MatchParamId = PropTypes.shape({
  params: PropTypes.shape({ id: PropTypes.string }).isRequired,
}).isRequired;
