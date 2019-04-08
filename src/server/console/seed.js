/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: Apr 08, 2019
 */


require("../app");
const mongoose = require("mongoose");


mongoose.connection.on('connected', function () {
  const seeders = ['user'];

  const promises = seeders.map((fileName) => {
    const seeder = require(`../seeders/${fileName}Seeder`);
    const Model = require(`../models/${fileName}`);

    return Model
      .deleteMany({})
      .exec()
      .then(seeder)
      .then((res) => console.log(`seeded ${res.lenght} items of ${fileName}Seeder.`))
      .catch(console.error);
  });

  Promise.all(promises).then(() => process.exit(0));
});


