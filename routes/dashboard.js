var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile('../public/dashboard.html', {root: __dirname})
  // req.session.user ? res.sendFile('../public/dashboard.html', {root: __dirname}) : res.sendFile('../public/index.html', {root: __dirname});
});


module.exports = router;
