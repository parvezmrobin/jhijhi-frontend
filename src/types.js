import PropTypes, {
  arrayOf,
  bool,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types';

function makeTypeMaker(type) {
  return function makeType(baseType) {
    const keyValues = Object.entries(baseType).filter(
      ([field]) => field !== '_id'
    );
    return Object.fromEntries(keyValues.map(([field]) => [field, type]));
  };
}

export const makeIsValidType = makeTypeMaker(bool);
export const makeFeedbackType = makeTypeMaker(string);

export const Location = {
  location: shape({
    search: string.isRequired,
  }).isRequired,
};

export const Named = {
  _id: string,
  name: string.isRequired,
};

const Player = {
  ...Named,
  jerseyNo: number.isRequired,
};

export const PlayerType = Player;

const Team = {
  ...Named,
  shortName: string.isRequired,
};

export const TeamType = Team;

const Umpire = {
  ...Named,
};

export const UmpireType = Umpire;

const Bowl = {
  _id: string.isRequired,
  playedBy: number.isRequired,
  isWicket: shape({
    kind: string,
    player: number,
  }),
  singles: number,
  by: number,
  legBy: number,
  boundary: shape({
    run: number,
    kind: string,
  }),
  isWide: bool.isRequired,
  isNo: string,
};

export const BowlType = Bowl;

const Over = {
  bowledBy: number.isRequired,
  bowls: arrayOf(shape(Bowl)),
};

export const OverType = Over;

const Innings = {
  overs: arrayOf(shape(Over)),
};

export const InningsType = Innings;

export const CompactMatchType = {
  _id: string,
  name: string.isRequired,
  overs: number.isRequired,
  team1: oneOfType([shape(Team), string]).isRequired,
  team2: oneOfType([shape(Team), string]).isRequired,
  umpire1: oneOfType([shape(Umpire), string]),
  umpire2: oneOfType([shape(Umpire), string]),
  umpire3: oneOfType([shape(Umpire), string]),
  team1Players: arrayOf(oneOfType([shape(Player), string])).isRequired,
  team2Players: arrayOf(oneOfType([shape(Player), string])).isRequired,
  team1Captain: oneOfType([shape(Player), string]),
  team2Captain: oneOfType([shape(Player), string]),
  team1WonToss: bool,
  team1BatFirst: bool,
  state: string.isRequired,
};

const Match = {
  ...CompactMatchType,
  innings1: shape(Innings),
  innings2: shape(Innings),
};

export const MatchType = Match;

export const MatchParamId = PropTypes.shape({
  params: PropTypes.shape({ id: PropTypes.string }).isRequired,
}).isRequired;
