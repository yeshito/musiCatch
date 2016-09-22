var express = require('express');
var router = express.Router();

router.get('/', (req, res, next) => {
  req.session.user ? res.sendFile('public/dashboard.html') : res.sendFile('public/index.html', {root: __dirname});
});


module.exports = router;
