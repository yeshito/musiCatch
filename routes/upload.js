'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');
const checkDb = require('../workers/checkDb.js').checkDb;

router.use(busboy({ immediate: true , limits: { files: 1, fileSize: 10000000 } }));

router.get('/', (req, res) => {
  console.log('req.session.user is: ' + req.session.user);
  req.session.user ? res.sendFile('public/upload.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html', { root: path.join(__dirname, '../') });
});

router.post('/', (req, res) => {
    res.sendFile('public/dashboard.html', { root: path.join(__dirname, '../') } );
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      let filePath = __dirname + '/files/' + req.session.user + filename;

        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);

        fstream.on('close', function () {

          fs.readFile(filePath , (err, data) => {

            let artists = data.toString().match(/<key>Artist<\/key><string>(.*?)<\/string>/g);
            let uniqueArtists = Array.from(new Set(artists));
            let trimmedArr = [];

            uniqueArtists.forEach( str => {

              let trimStr = str.replace(/<key>Artist<\/key><string>|<\/string>/g, '');

              if (trimStr.search(/&#38;|,/) !== -1) {
                let artistArr = trimStr.split(/\s?&#38;\s?|\s?,\s?/g);
                trimmedArr.push(...artistArr);
              } else {
                trimmedArr.push(trimStr);
              }
            })

            let finalArtists = Array.from(new Set(trimmedArr));
            let sortedArtists = finalArtists.sort();

            console.log('sortedArtists is: ' + JSON.stringify(sortedArtists));
            console.log('sortedArr.length is: ' + sortedArtists.length);
            checkDb(sortedArtists, req.session.user);
          })
            // deletes xml itunes file after use
            fs.unlink(filePath);
        });

    });
});

module.exports = router;
