/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 05, 2019
 */


module.exports = {
  auth: {
    register: {
      ok: "Successfully registered as a new user.",
      err: "Error while registering as a new user.",
    },
  },
  players: {
    index: {
      err: "Error while retrieving player list",
    },
    get: {
      err: 'Player could not found',
    },
    stat: {
      ok: (name) => `Successfully generated stat for player ${name}`,
      err: "Error while generating stat",
    },
    create: {
      ok: (name) => `Successfully created player ${name}`,
      err: "Error while creating player",
    },
    edit: {
      ok: (name) => `Successfully edited player ${name}`,
      err: "Error while editing player",
    },
  },
  teams: {
    index: {
      err: "Error while retrieving team list",
    },
    create: {
      ok: (name) => `Successfully created team ${name}`,
      err: "Error while creating team",
    },
  },
  matches: {
    index: {
      err: "Error while retrieving match list",
    },
    create: {
      ok: (name) => `Successfully created match ${name}`,
      err: "Error while creating match",
    },
    begin: {
      ok: `Successfully started match`,
      err: "Error while starting match",
    },
    toss: {
      ok: `Successfully tossed match`,
      err: "Error while tossing match",
    },
    get: {
      err: "Error while retrieving match",
    },
    e404: "Could not find a match with given id",
  },
  umpires: {
    index: {
      err: "Error while retrieving umpire list",
    },
    create: {
      ok: (name) => `Successfully created umpire ${name}`,
      err: "Error while creating umpire",
    },
  },
};
