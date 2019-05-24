/**
 * Parvez M Robin
 * parvezmrobin@gmail.com
 * Date: May 16, 2019
 */

const { copyFileSync } = require('fs');
const { join } = require('path');

const baseDir = join(__dirname, '..', '..', '..');

copyFileSync(join(baseDir, 'statics', 'manifest.json'), join(baseDir, 'public', 'manifest.json'));
copyFileSync(join(baseDir, 'statics', 'favicon.png'), join(baseDir, 'public', 'favicon.png'));
copyFileSync(join(baseDir, 'statics', '/frustrated.gif'), join(baseDir, 'public', '/frustrated.gif'));

process.exit(0);
