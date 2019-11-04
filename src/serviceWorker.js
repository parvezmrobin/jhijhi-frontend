/**
 * Parvez M Robin
 * this@parvezmrobin.com
 * Date: Nov 02, 2019
 */

/* eslint-disable no-restricted-globals */
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');

  evt.waitUntil(
    caches.open('Jhijhi')
      .then(caches => {
        console.log('cache loaded');
        return caches;
      }),
  );
});
