'use strict'
//Connect to Redis to get queue of people who need to be reminded
const express = require('express');
const router = express.Router();
const redis = require('../db/redis.js');
const request = require('request')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));

function getArtistId() {
  const session = driver.session();
  redis.lrangeAsync([ "artistNames", 0, -1]).then( artistNames => {
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
          if (error) {
            session.close();
            driver.close();
            return console.log('step 1 itunes API error: ' + error);
          }

          if (!error && response.statusCode == 200) {
            let bodyJSON = JSON.parse(body);
            let artistObj = bodyJSON.results[0];
            console.log(JSON.stringify(artistObj))
            session.run("CREATE (a:Artist { wrapperType: {wrapperType}, artistType: {artistType}, artistName: {artistName}, artistLinkUrl: {artistLinkUrl}, artistId: {artistId}, primaryGenreName: {primaryGenreName}, primaryGenreId: {primaryGenreId} })"
                      , { wrapperType: artistObj.wrapperType, artistType: artistObj.artistType, artistName: artistObj.artistName, artistLinkUrl: artistObj.artistLinkUrl, artistId: artistObj.artistId, primaryGenreName: artistObj.primaryGenreName, primaryGenreId: artistObj.primaryGenreId })
                      .then( result => {
                        return session.run("MATCH (a:Artist { artistId: {artistId} }), " +
                                                  "(u:User) WHERE ID(u) = {userId} " +
                                            "MERGE (a)-[r:LIKES]->(u)", { artistId: artistObj.artistId, userId: userId })
                    }).then( result => {
                      console.log(result);
                      session.close();
                      driver.close();
                    }).catch( err => {
                      console.log(err);
                      session.close();
                      driver.close();
                    });
          };
      })
    })
    // }
  })
};

module.exports = {
  getArtistId: () => {
    getArtistId();
  }
};
