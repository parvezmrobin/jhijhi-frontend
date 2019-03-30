const express = require('express');

/**
 * User router
 * @var router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();
const os = require('os');


/* GET users listing. */
router.get('/', (req, res) => {
  res.json([{
    username: os.userInfo().username,
  }]);
});

module.exports = router;
