const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

router.use(busboy({ immediate: true , limits: { files: 1, fileSize: 10000000 } }));

router.get('/', (req, res) => {
  console.log('req.session.user is: ' + req.session.user);
  req.session.user ? res.sendFile('public/upload.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html');
});

router.post('/', (req, res) => {
    let fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        fstream = fs.createWriteStream(__dirname + '/files/' + req.session.user + filename);
        file.pipe(fstream);
        fs.readFile(__dirname + '/files/' + req.session.user + filename, (err, data) => {
          parser.parseString(data, (err, result) => {
            console.log('data is: ' + data)
            // data is the xml string that I want!
          })
        })
        fstream.on('close', function () {
            res.send('fucking wrote the book!');
        });
    });
});

module.exports = router;
