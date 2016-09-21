'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');

router.use(busboy({ immediate: true , limits: { files: 1, fileSize: 10000000 } }));

router.get('/', (req, res) => {
  console.log('req.session.user is: ' + req.session.user);
  req.session.user ? res.sendFile('public/upload.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html');
});

router.post('/', (req, res) => {

    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
      let filePath = __dirname + '/files/' + req.session.user + filename;

        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);

        fstream.on('close', function () {

          fs.readFile(filePath , (err, data) => {

            let artists = data.toString().match(/<key>Artist<\/key><string>(.*?)<\/string>/g);
            let uniqueArtists = Array.from(new Set(artists))
            console.log(JSON.stringify(uniqueArtists));

            let trimmedArr = [];
            uniqueArtists.forEach( str => {

              let trimStr = str.replace(/<key>Artist<\/key><string>|<\/string>/g, '');

              if (trimStr.search(/&#38;|,/) !== -1) {
                trimStr = trimStr.split(/\s?&#38;\s?|\s?,\s?/g);
                trimmedArr.push(...trimStr);
              } else {
                trimmedArr.push(trimStr);
              }
            })

            let sortedArtists = trimmedArr.sort();
            console.log('sortedArr is: ' + JSON.stringify(sortedArtists));

          })

        });
    });
});

module.exports = router;
