/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


require("../app");
const mongoose = require("mongoose");

const seed = function (fileName) {
  const seeder = require(`../seeders/${fileName}Seeder`);
  const Model = require(`../models/${fileName}`);

  return Model
    .deleteMany({})
    .exec()
    .then(seeder)
    .then((res) => console.log(`seeded ${!res ? res : res.length} items of ${fileName}Seeder.`))
    .catch(console.error);
};


mongoose.connection.on('connected', function () {
  const seeders = ['player', 'team'];

  seed('user')
    .then(() => {
      const promises = seeders.map(seed);

      Promise.all(promises).then(() => process.exit(0));
    })
});


