var express = require('express');
var router = express.Router();
var path = require('path');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile('public/upload.html', { root: path.join(__dirname, '../') })
    // req.session.user ? res.send('../public/upload.html') : res.send('../public/index.html');
});


module.exports = router;
