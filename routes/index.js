const express = require('express');
const router = express.Router();
const path = require('path');
  
/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('req.session.user in index route is: ' + req.session.user)
  res.sendFile('public/dashboard.html', { root: path.join(__dirname, '../') })
  // req.session.user ? res.sendFile('public/dashboard.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html', { root: path.join(__dirname, '../') });
});


module.exports = router;
