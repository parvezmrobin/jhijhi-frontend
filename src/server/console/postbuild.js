/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 16, 2019
 */

const { renameSync, readdirSync } = require('fs');
const { join } = require('path');

const baseDir = join(__dirname, '..', '..', '..');

console.log(readdirSync(baseDir));
renameSync(join(baseDir, 'dist'), join(baseDir, 'public'));

process.exit(0);
