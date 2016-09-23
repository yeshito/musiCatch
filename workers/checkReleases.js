'use strict'
//Connect to Redis to get queue of people who need to be reminded
const express = require('express');
const router = express.Router();
const redis = require('../db/redis.js');
const request = require('request')
const neo4j = require('neo4j-driver').v1;
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "capstone4"));
const fs = require('fs');
const parseString = require('xml2js').parseString;

request('https://itunes.apple.com/WebObjects/MZStore.woa/wpa/MRSS/newreleases/sf=143441/limit=100/explicit=true/rss.xml', (error, response, body) => {

  if(error){
        return console.log('Error:', error);
    }
    //Check for right status code
    if(response.statusCode !== 200){
        return console.log('Invalid Status Code Returned from release request: ', response.statusCode);
    }

    let session = driver.session();
    //All is good. Print the body
    parseString( body, (err, result) => {
      let newDate = new Date().toString();

      session
      .run( "MATCH (l:lastReleaseCheck) RETURN l.date as lastDate")
      .then( record => {
        let lastDate = record.records[0].get("lastDate");
        let dummyDate = 1474320695;
        return session.run("MATCH (l:lastReleaseCheck) SET l.date = {date} RETURN l", {date: newDate})
        .then( record => {

          const releasesArr = result.rss.channel[0].item;
          let release = result.rss.channel[0].item[0]
          // releasesArr.forEach(release => {
            if (Date.parse(release.pubDate) > dummyDate) {
              console.log('itms:artist is: ' + release['itms:artist']);
              return session
                .run( "MATCH (a:Artist) WHERE a.artistName = {artist} RETURN a.artistId as appleId", {artist: release['itms:artist']})
                .then(result => {
                    if (result.records.length === 0) {
                      let artistObj = JSON.stringify({artistName: artistsArr[2], userId: userId});
                      redis.lpush('artistNames', artistObj);
                    } else {
                      console.log('result.records[0].get("appleId"): ' + result.records[0].get("appleId"));
                      return session.run("MATCH (a:Artist {artistId: {artistId} }) " +
                                        "MATCH (u:User) WHERE ID(u) = {userId} " +
                                        "CREATE (u)-[r:LIKES]->(a) " +
                                        "RETURN r", { artistId: result.records[0].get("appleId"), userId: userId})
                        .then( result => {
                        console.log('result is: ' + JSON.stringify(result));
                      }).catch(err => {
                        console.log(err);
                      })
                    }

                }).catch(err => {
                  console.log(err)
                }).then( result => {
                  getArtistId();
                  session.close();
                  driver.close();
                })
            }



          // })
          session.close();
          driver.close();
        })



      }).catch(err => {
        console.log('lastReleaseCheck node creation error: ' + err);
      })




    });
})
// .pipe(fs.createWriteStream('newReleases.xml'))
