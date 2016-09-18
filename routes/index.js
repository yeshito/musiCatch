var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    req.session.user ? res.send('../public/upload.html') : res.send('../public/index.html');
});

module.exports = router;
