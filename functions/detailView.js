const express = require('express');
const fs = require('fs');
const functions = require('firebase-functions');

const index = fs.readFileSync(__dirname + '/index.template.html', 'utf8');
const app = express();
app.get('**', (req, res) => {
  const finalHtml = index.replace('<!-- ::APP:: -->', "<h1>HelloWorld</h1>");
  res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
  res.send(finalHtml);
});

exports.detailView = functions.https.onRequest(app);
