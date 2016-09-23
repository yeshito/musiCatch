'use strict'
//Connect to Redis to get queue of people who need to be reminded
const express = require('express');
const router = express.Router();
const redis = require('../db/redis.js');
const request = require('request')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
const getArtistId = require("./getArtistId.js").getArtistId;

function checkDb(artistsArr, userId) {

  const session = driver.session();

  console.log('input artist is: ' + artistsArr[1]);
  // artistsArr.forEach(artist => {
    session
      .run( "MATCH (a:Artist) WHERE a.artistName = {artist} RETURN a.artistId as appleId", {artist: artistsArr[1]})
      .then(result => {
          if (result.records.length === 0) {
            let artistObj = JSON.stringify({artistName: artistsArr[1], userId: userId});
            redis.lpush('artistNames', artistObj);
          } else {
            console.log('result.records[0].get("appleId"): ' + result.records[0].get("appleId"));
            return session.run("MATCH (a:Artist {artistId: {artistId} }) " +
                              "MATCH (u:User) WHERE ID(u) = {userId} " +
                              "CREATE UNIQUE (u)-[:LIKES]->(a) " +
                              "RETURN u", { artistId: result.records[0].get("appleId"), userId: userId})
              .then( result => {
              console.log('result is: ' + JSON.stringify(result));
            }).catch(err => {
              console.log(err);
            })
          }

      }).catch(err => {
        console.log(err)
        session.close();
      }).then( result => {
        getArtistId();
      })
    })
}


module.exports = {
  checkDb: (artistsArr, userId) => {
    checkDb(artistsArr, userId);
  }
};
