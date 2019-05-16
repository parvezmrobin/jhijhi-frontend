/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 16, 2019
 */

const { copyFileSync } = require('fs');
const { join } = require('path');

const baseDir = join(__dirname, '..', '..', '..');

copyFileSync(join(baseDir, 'statics', 'manifest.json'), join(baseDir, 'public', 'manifest.json'));
copyFileSync(join(baseDir, 'statics', 'favicon.svg'), join(baseDir, 'public', 'favicon.svg'));

process.exit(0);
