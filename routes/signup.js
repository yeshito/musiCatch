'use strict';
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
var session = driver.session();
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');

router.post('/', (req, res, next) => {

  var hash = bcrypt.hashSync(req.body.newPassword, 8);

  session
    .run( "MATCH (a:User) WHERE a.email = {email} RETURN a", { email: req.body.newEmail })
    .then( result => {

      if(result.records.length > 0) {
        res.send('email already exists!');
      } else {

        return session.run("CREATE (u:User { firstName: {firstName}, email: {email}, cellNum: {cellNum}, password: {hash}, signupDate: {signupDate} }) " +
                          "RETURN id(u) as id"
                          , { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.newEmail, cellNum: req.body.newCellNum, hash: hash , signupDate: new Date().toString() })
                  .then( user => {
                    console.log(user)
                    let userId = user.records[0]['_fields'][0]['low'];
                    req.session.user = userId;
                    res.send('../public/upload.html');
                }, error => {
                  console.log(error);
                })
      }
      session.close();
      driver.close();
    })
})
module.exports = router;
