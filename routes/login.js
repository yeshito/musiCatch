'use strict';
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

router.post('/', (req, res, next) => {

  const session = driver.session();
  session
    .run( "MATCH (u:User) WHERE u.email = {email} RETURN u", { email: req.body.email })
    .then(result => {

      if(result.records.length > 0) {
        let password = result.records[0]['_fields'][0]['properties']['password'];

        if (bcrypt.compareSync(req.body.password, password)) {
          let userId = result.records[0]['_fields'][0]['identity']['low'];
          req.session.user = userId;
          res.redirect('/upload');
        } else {
          res.send('username/password do not match')
          console.log('password not matched!')
        }
      } else {
        res.send('username/password do not match')
        console.log('username not matched!')
      }
      session.close();
      // driver.close();
    }).catch(err => {
      session.close();
      console.log(err)
    })
})
module.exports = router;
