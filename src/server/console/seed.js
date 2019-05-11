/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


const mongoose = require('mongoose');
const config = require('../config');

const seed = function (fileName, userId) {
  const seeder = require(`../seeders/${fileName}Seeder`);
  const Model = require(`../models/${fileName}`);

  return Model
    .deleteMany(userId ? { creator: userId } : null)
    .exec()
    .then(() => seeder(userId))
    .then((res) => {
      console.log(`seeded ${!res ? res : res.length} items of ${fileName}Seeder.`);
    })
    .catch(console.error);
};

try {
  mongoose
    .connect(config.db, {
      useNewUrlParser: true,
      useFindAndModify: false,
    })
    .then(async () => {
      console.log('Connected to database: \'jhijhi\'');
      const seeders = ['player', 'team', 'match'];

      let userId;
      const username = process.argv[2];
      if (username) {
        const { hashSync } = require('bcrypt');
        const User = require('../models/user');
        const user = await User.findOneAndUpdate({ username: username }, { password: hashSync(username, 10) }, { upsert: true, new: true });
        userId = user._id;
      } else {
        await seed('user');
      }

      for (const seeder of seeders) {
        await seed(seeder, userId);
      }

      process.exit(0);
    });
} catch (e) {
  console.error(e);
  process.exit(1);
}


