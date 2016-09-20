var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  console.log('req.session.user in index route is: ' + req.session.user)
  req.session.user ? res.sendFile('public/dashboard.html') : res.sendFile('public/index.html', {root: __dirname});
});


module.exports = router;
