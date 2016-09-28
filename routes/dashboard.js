const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res, next) => {
  res.sendFile('public/dashboard.html', {root: path.join(__dirname, '../')})
  // req.session.user ? res.sendFile('../public/dashboard.html', {root: __dirname}) : res.sendFile('../public/index.html', {root: __dirname});
});


module.exports = router;
