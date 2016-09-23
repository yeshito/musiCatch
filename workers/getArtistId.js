'use strict'
//Connect to Redis to get queue of people who need to be reminded
const express = require('express');
const router = express.Router();
const redis = require('../db/redis.js');
const request = require('request')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));

function getArtistId() {

  redis.lrangeAsync([ "artistNames", 0, -1]).then( artistNames => {
  console.log('callback artistNames is: ' + artistNames);
  //We're gonna loop through the number of verify in the queue, but we're not using the verify we got back from the queue
    // for (var i = 0; i < artistNames.length+1; i++) {
    //This operation pulls one out of the queue, so that if we have multiple processes working on the same queue we need to only operate on messages that have not already been removed from the queue.
      redis.lpop(["artistNames"], (err, artistJSON) => {
        if (err) return;
        if (!artistJSON) process.exit(0); //if multiple workers are processing the queue, we will eventually get null values - in that case, stop.
        let artistObj = JSON.parse(artistJSON);
        let artistName = artistObj['artistName'].replace(/\s/g, '+');
        let userId = artistObj['userId'];
        console.log(artistName + ' ' + userId);
        request
        .get(`https://itunes.apple.com/search?entity=musicArtist&term=${artistName}`, (error, response, body) => {
          if (error) return console.log('step 1 itunes API error: ' + error);
          console.log('hey!')
          if (!error && response.statusCode == 200) {
            let bodyJSON = JSON.parse(body);
            let artistID = bodyJSON.results[0]['artistId'];
            // put stuff into neo4j here
          }
        });
      });
    // }
  })
};

module.exports = {
  getArtistId: () => {
    getArtistId();
  }
};
