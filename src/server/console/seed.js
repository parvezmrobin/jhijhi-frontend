/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const mongoose = require('mongoose');
const config = require('../config');

const seed = function (fileName) {
  const seeder = require(`../seeders/${fileName}Seeder`);
  const Model = require(`../models/${fileName}`);

  return Model
    .deleteMany({})
    .exec()
    .then(seeder)
    .then((res) => {
      console.log(`seeded ${!res ? res : res.length} items of ${fileName}Seeder.`);
    })
    .catch(console.error);
};

mongoose
  .connect(config.db, { useNewUrlParser: true })
  .then(async () => {
    console.log('Connected to database: \'jhijhi\'');
    const seeders = ['player', 'team', 'match'];

    await seed('user');

    for (const seeder of seeders) {
      await seed(seeder);
    }

    process.exit(0);
  });


