const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const uploadPath = path.resolve(__dirname, '../server/public/uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '.png');
  }
});
const upload = multer({ storage }).single('testImage');

const phrases = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());
if(process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public/"));

  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`server started on port ${port}`));

const vision = require('@google-cloud/vision');
const credentials = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_id,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url
}
const client = new vision.ImageAnnotatorClient({
  credentials
});

app.get('/api/phrase', upload, async (req, res) => {
  try {
    const phraseIndex = Math.floor(Math.random()*phrases.length);
    const phrase = phrases[phraseIndex];
    const phraseResponse = {
      ...phrase,
      phraseIndex
    }

    res.send({status: 200, phraseResponse});
  } catch(err) {
    console.log(err)
    res.send({status: 400});
  }
});

app.post('/api/test', upload, async (req, res) => {
  try {
    const imagePath = `${uploadPath}/${req.file.fieldname}.png`;
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    console.log(detections)
    const answer = detections.length ? detections[0].description : 'no results found';

    fs.unlink(imagePath, (err) => {
      if(err) {
        throw(err);
      }
    });

    res.send({status: 200, answer});
  } catch(err) {
    console.log(err)
    res.send({status: 400});
  }
});
