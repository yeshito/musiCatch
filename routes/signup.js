var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {

  console.log('signup route hit yo!')
  var hash = bcrypt.hashSync(req.body.newPassword, 8); //we use bcrypt to convert password into hash

  knex('users').select().where( 'username', '=', req.body.newUsername ).then(function(results) {
    console.log('results are: ' + results);
    console.log('results.length is: ' + results.length);
    if (results.length === 0) {
      knex('users').insert({ username: req.body.newUsername , password: hash, email: req.body.newEmail }).then(function (){
          req.session.username = req.body.newUsername;
          res.redirect(`/users/${req.session.username}/profile`);
      });
    } else {
      res.render('register.nunjucks', { error: 'Username already exists, please try again' });
    }
  });
})
module.exports = router;
