'use strict';
const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const parser = new xml2js.Parser({strict: false, trim: true});
const xmlStream = require('xml-stream');
// element tree
const et = require('elementtree');
const XML = et.XML;
const ElementTree = et.ElementTree;
const element = et.Element;
const subElement = et.SubElement;

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
      // console.log(filePath)
        fstream = fs.createWriteStream(filePath);
        file.pipe(fstream);
        // let stream = fs.createReadStream(filePath);
        // let xml = new xmlStream(stream);

        fstream.on('close', function () {
          // data = fs.readFileSync('document.xml').toString();
          // etree = et.parse(data);

          // console.log(etree.findall('*'))
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


            // parser.parseString(data, (err, result) => {
            //   let artistArr = [];
            //   result['PLIST']['DICT'].forEach(el => {
            //     artistArr.push(el['STRING'][2]);
            //   });
            //   console.log(JSON.stringify(artistArr.sort()))
            //
            // })
          })

        });
    });
});

module.exports = router;
