const express = require('express');

/**
 * Index router
 * @var router
 * @property {Function} get
 * @property {Function} post
 * @property {Function} put
 * @property {Function} delete
 */
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.json({ title: 'Jhijhi' });
});

module.exports = router;
