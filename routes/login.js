var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
var session = driver.session();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

router.post('/', (req, res, next) => {
  console.log('login route hit Yo!')
  knex('users').select().where('username', req.body.username ).then(function (user) {
        if (user.length !== 0) {
            var hash = bcrypt.hashSync(req.body.password, 8);
            if (bcrypt.compareSync(req.body.password, user[0].password)) {

              knex('users').where('username', req.body.username).update('available', true)
              .then(function() {
                req.session.username = user[0].username;
                req.session.photo = user[0].photo;
                res.redirect(`/users/${user[0].username}`);
              });
            } else {
              res.render('login.nunjucks', { error: "Username/password don't match" });
              console.log('passwords do not match yo');
            }
        } else {
          res.render('login.nunjucks', { error: "Username/password don't match" });
          console.log('username not found yo');
          }
    });

  session
    .run( "MATCH (u:User) WHERE u.email = {email} RETURN u", { email: req.body.email })
    .then(function(result) {
      console.log(JSON.stringify(result));

      if(result.records.length > 0) {
        res.send('email already exists!');
      } else {

        return session.run("CREATE (u:User { firstName: {firstName}, lastName: {lastName}, email: {email}, password: {hash}, signupDate: {signupDate} }) " +
                          "RETURN id(u)", {firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.newEmail, hash: hash , signupDate: new Date().toString()})
                  .then(function(user) {
                    let userId = user.records[0]['_fields'][0]['low'];
                    req.session.user = userId;
                    // res.redirect()
                }, (error) => {
                  console.log(error);
                })
      }
      session.close();
      driver.close();
    })

})
module.exports = router;
