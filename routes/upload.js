const express = require('express');
const router = express.Router();
const path = require('path');
const busboy = require('connect-busboy');
const fs = require('fs');
const bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser)
// const xmlStream = require('xml-stream');
// const bodyParser = require('body-parser');
// router.use(busboy());
/* GET upload page. */
// router.use(busboy({ immediate: true , limits: { files: 1, fileSize: 10000000 } }));

router.get('/', (req, res) => {
  console.log('req.session.user is: ' + req.session.user)
  req.session.user ? res.sendFile('public/upload.html', { root: path.join(__dirname, '../') }) : res.sendFile('public/index.html');
});

router.post('/', (req, res) => {
  console.log('req.body is: ' + JSON.stringify(req.body));
    // var fstream;
    // req.pipe(req.busboy);
    // req.busboy.on('file', function (fieldname, file, filename) {
    //     console.log("Uploading: " + filename);
    //     console.log(file);
    //     fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    //     file.pipe(fstream);
    //     fstream.on('close', function () {
    //         res.redirect('back');
    //     });
    // });
});
// router.post('/', (req, res) => {
//   console.log('req.body is: ' + JSON.stringify(req.body));
//   console.log('req.files is: ' + JSON.stringify(req.files));
//   // req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
//   //   // console.log('file is: ' + JSON.stringify(file))
//   //   // console.log('filename is: ' + JSON.stringify(fieldname));
//   //   // console.log('req.files is: ' + JSON.stringify(req.files));
//   // })
//   // file.on('data', data => {
//   //   console.log('data is: ' + JSON.stringify(data))
//   // })
//   // req.busboy.on('finish', () => {
//   //
//   // })
// })


module.exports = router;
