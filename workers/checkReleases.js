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

    //All is good. Print the body
    parseString( body, (err, result) => {
      if (err) console.log(err);

      let newDate = new Date().toString();
      let session = driver.session();

      session
      .run( "MATCH (l:lastReleaseCheck) RETURN l.date AS lastDate")
      .then( record => {
        let lastDate = record.records[0].get("lastDate");
        let dummyDate = 1474320695;

        return session.run("MATCH (l:lastReleaseCheck) SET l.date = {date} RETURN l", {date: newDate})
        .catch( err => {
          console.log(err)
        })
        .then( record => {

          const releasesArr = result.rss.channel[0].item;

          // let release0 = result.rss.channel[0].item[0]
          // let release1 = result.rss.channel[0].item[1]
          let release = result.rss.channel[0].item[8];

          // releasesArr.forEach( release => {
          // If release is more recent then last time release were checked add to Db
            if (Date.parse(release.pubDate[0]) > dummyDate) {

              let releaseArtistId = release['itms:artistLink'][0].match(/id(\d+)\?/)[1];

              return session
              .run("CREATE (r:Release { title: {title}, link: {link}, description: {description}, pubDate: {pubDate}, contentEncoded: {contentEncoded}, category: {category}, " +
                 "artist: {artist}, artistLink: {artistLink}, album: {album}, albumPrice: {albumPrice}, coverArt: {coverArt}, rights: {rights}, releaseDate: {releaseDate} }) " +
                 "RETURN ID(r) AS releaseId",
                 { title: release.title[0], link: release.link[0], description: release.description[0], pubDate: release.pubDate[0], contentEncoded: release['content:encoded'][0],
                   category: release.category[0]['_'], artist: release['itms:artist'][0], artistLink: release['itms:artistLink'][0], album: release['itms:album'][0], albumLink: release['itms:albumLink'][0],
                   albumPrice: release['itms:albumPrice'][0], coverArt: release['itms:coverArt'][2]['_'], rights: release['itms:rights'][0], releaseDate: release['itms:releasedate'][0] })
                   .then( result => {
                     console.log('record after creating release is: ' + JSON.stringify(result))
                     let releaseId = result.records[0].get("releaseId");
                     console.log('releaseId is: ' + releaseId);
                     console.log('releaseArtistId is: ' + releaseArtistId);
                     return session
                     .run( "MATCH (a:Artist) WHERE a.releaseArtistId = {releaseArtistId} RETURN a.releaseArtistId AS appleId", { releaseArtistId: parseInt(releaseArtistId, 10) } )
                     .then( record => {
                        console.log('record after matching artist' + JSON.stringify(record))

                        console.log('record.records[0].get("appleId"): ' + record.records[0].get("appleId"))

                         if (record.records.length === 0) {
                          //  console.log('record.records.length === 0 is hit!')
                          //  console.log('releaseArtistId is: ' + releaseArtistId)
                           request
                           .get(`https://itunes.apple.com/lookup?id=${releaseArtistId}`, (error, response, body) => {

                             if (error) return console.log('release get artist itunes API error: ' + error);
                             if (!error && response.statusCode == 200) {
                               let bodyJSON = JSON.parse(body);
                               let artistObj = bodyJSON.results[0];
                              //  console.log(JSON.stringify(artistObj))

                             return session.run("CREATE (a:Artist { wrapperType: {wrapperType}, artistType: {artistType}, artistName: {artistName}, artistLinkUrl: {artistLinkUrl}, artistId: {artistId}, primaryGenreName: {primaryGenreName}, primaryGenreId: {primaryGenreId} })"
                                         , { wrapperType: artistObj.wrapperType, artistType: artistObj.artistType, artistName: artistObj.artistName, artistLinkUrl: artistObj.artistLinkUrl, artistId: artistObj.artistId, primaryGenreName: artistObj.primaryGenreName, primaryGenreId: artistObj.primaryGenreId })
                                         .then( record => {
                                          //  console.log("record after creating artist" + JSON.stringify(record))
                                           return session.run("MATCH (a:Artist { artistId: {artistId} }) " +
                                                              "MATCH (r:RELEASE) WHERE ID(r) = {releaseId} " +
                                                              "CREATE (a)-[e:RELEASED]->(r) " +
                                                              "RETURN e", { releaseId: releaseId, artistId: releaseArtistId })
                                       }).then( record => {
                                        //  console.log('record after creating relationship between artist and release' + JSON.stringify(record));
                                       }).catch( err => {
                                         console.log(err);
                                       })
                             };
                           });
                         } else {
                          //  console.log('result.records[0].get("appleId"): ' + record.records[0].get("appleId"));
                           return session.run("MATCH (a:Artist {artistId: {artistId} }) " +
                                             "(r:RELEASE) WHERE ID(r) = {releaseId} " +
                                             "CREATE (a)-[r:RELEASED]->(r)" , { artistId: releaseArtistId, userId: userId})
                             .then( record => {
                             console.log('record is: ' + JSON.stringify(record));
                           }).catch(err => {
                             console.log(err);
                           })
                         }

                     }).catch(err => {
                       console.log(err)
                     }).then( record => {
                       // getArtistId();
                       // session.close();
                       // driver.close();
                     })
                       })
            }
          })
          session.close();
          driver.close();
        }).catch(err => {


          console.log(err)
        })

      })

    })
// })
