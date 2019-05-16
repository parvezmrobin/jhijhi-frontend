/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 16, 2019
 */

const { renameSync } = require('fs');
const { join } = require('path');

const baseDir = join(__dirname, '..', '..', '..');
renameSync(join(baseDir, 'dist'), join(baseDir, 'public'));

process.exit(0);
