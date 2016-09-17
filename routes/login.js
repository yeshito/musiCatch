var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
  console.log('login route hit Yo!')
  // knex('users').select().where('username', req.body.username ).then(function (user) {
  //       if (user.length !== 0) {
  //           var hash = bcrypt.hashSync(req.body.password, 8);
  //           if (bcrypt.compareSync(req.body.password, user[0].password)) {
  //
  //             knex('users').where('username', req.body.username).update('available', true)
  //             .then(function() {
  //               req.session.username = user[0].username;
  //               req.session.photo = user[0].photo;
  //               res.redirect(`/users/${user[0].username}`);
  //             });
  //           } else {
  //             res.render('login.nunjucks', { error: "Username/password don't match" });
  //             console.log('passwords do not match yo');
  //           }
  //       } else {
  //         res.render('login.nunjucks', { error: "Username/password don't match" });
  //         console.log('username not found yo');
  //         }
  //   });
})
module.exports = router;
