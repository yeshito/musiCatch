'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');
const request = require('request');

router.use(busboy({ immediate: true , limits: { files: 1, fileSize: 10000000 } }));

router.get('/', (req, res) => {
  console.log('req.session.user is: ' + req.session.user);
  req.session.user ? res.sendFile('public/upload.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html');
});

router.post('/', (req, res) => {
    res.send('File uploaded!')
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
                let searchArtists = artistArr.map(artist => {
                  artist.replace(/\s/g, '+');
                })
                trimmedArr.push(...searchArtists);
              } else {
                let searchArtist = trimStr.replace(/\s/g, '+');
                trimmedArr.push(searchArtist);
              }
            })

            let finalArtists = Array.from(new Set(trimmedArr));
            let sortedArtists = finalArtists.sort();

            console.log('sortedArtists is: ' + JSON.stringify(sortedArtists));
            console.log('sortedArr.length is: ' + sortedArtists.length);
            // sortedArtists.forEach(artistName => {
              request
              .get(`https://itunes.apple.com/search?entity=musicArtist&term=${sortedArtists[0]}`, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                  console.log(body) // Show the HTML for the Google homepage.
                }
              })
            // })
          })
            // deletes xml itunes file after use
            fs.unlink(filePath);
        });

    });
});

module.exports = router;
