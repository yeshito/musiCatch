var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    // check for session cookie req.session.username ? res.redirect() : res.send('../public/index.html');
    res.send('../public/index.html');
});

module.exports = router;
