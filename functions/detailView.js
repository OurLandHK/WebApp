const express = require('express');
const fs = require('fs');
const functions = require('firebase-functions');
const index = fs.readFileSync(__dirname + '/detailView.template.html', 'utf8');
const cors = require('cors')({origin: true});
const app = express();
const admin = require('firebase-admin');

function getMessage(uuid) {
  const db = admin.firestore();
  var collectionRef = db.collection('message');
  var docRef = collectionRef.doc(uuid);
  return docRef.get().then(function(doc) {
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
    }
  });     
}

app.get('**', (req, res) => {
  cors(req, res, () => {});
  const segments = req.url.split('/');
  let path = segments[segments.length - 1].split('?');
  const uuid = path[0];
  console.log(uuid);
  getMessage(uuid).then(message => {
    let finalHtml = index;
    console.log(message);
    if (message) {
      finalHtml = finalHtml.replace('<!--og:title-->', message.text);
      finalHtml = finalHtml.replace('<!--og:description-->', message.text + '\n' + message.streetAddress);
      finalHtml = finalHtml.replace('<!--og:image-->', message.publicImageURL);
      finalHtml = finalHtml.replace('<!--og:image:width-->', '400');
      finalHtml = finalHtml.replace('<!--og:image:height-->', '300');
      finalHtml = finalHtml.replace('<!--og:type-->', 'article');
      finalHtml = finalHtml.replace('<!--og:url-->', req.url);
      res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    }
    res.send(finalHtml);
  })
});

exports.detailView = functions.https.onRequest(app);
