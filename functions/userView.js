const express = require('express');
const fs = require('fs');
const functions = require('firebase-functions');
const index = fs.readFileSync(__dirname + '/userView.template.html', 'utf8');
const cors = require('cors')({origin: true});
const app = express();
const admin = require('firebase-admin');

function getUserProfile(userid) {
    // Use firestore
    if(userid==null) {
        return null;
    }
    const db = admin.firestore();
    //const settings = {/* your settings... */ timestampsInSnapshots: true};
    //db.settings(settings);
    let collectionRef = db.collection(`userProfile`);
    let docRef = collectionRef.doc(userid);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data());
        } else {
            return(null);
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
        return(null);
    });
}

function getBookmark(uid, key) {
    // firestore
    // Use firestore
    const db = admin.firestore();
    //const settings = {/* your settings... */ timestampsInSnapshots: true};
    //db.settings(settings);
    let collectionRef = db.collection(`userProfile`).doc(uid).collection(`Bookmark`);
    let docRef = collectionRef.doc(key);
    return docRef.get().then(function(doc) {
        if (doc.exists) {
            return(doc.data());
        } else {
            return null;
        }
    });     
}



app.get('**', (req, res) => {
  cors(req, res, () => {});
  const parts = req.url.split('/');
  let userIndex = parts.length - 1;
  while(userIndex > 0) {
      //console.log(req.url + "  " + parts[userIndex] + " " + userIndex)
      if(parts[userIndex] == 'user') {
            userIndex++;
            break;
      }
      userIndex--;
  }
  const userid = parts[userIndex];
  let bookmarkid = null;
  if(userIndex < parts.length - 1) {
    bookmarkid = parts[userIndex+1];
  }
  console.log(`userID ${userid} bookmarkID ${bookmarkid}`);
  return getUserProfile(userid).then(userPrfile => {
    let finalHtml = index;
    if (userPrfile) {
        finalHtml = finalHtml.replace('<!--og:image-->', userPrfile.photoURL);
        finalHtml = finalHtml.replace('<!--og:image:width-->', '400');
        finalHtml = finalHtml.replace('<!--og:image:height-->', '300');
        finalHtml = finalHtml.replace('<!--og:type-->', 'article');
        finalHtml = finalHtml.replace('<!--og:url-->', req.url);
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        if(bookmarkid == null ) {
            finalHtml = finalHtml.replace('<!--og:title-->', userPrfile.displayName);
            finalHtml = finalHtml.replace('<!--og:description-->', userPrfile.desc);
            return res.send(finalHtml);
 
        } else {
            return getBookmark(userid, bookmarkid).then(bookmark => {
                finalHtml = finalHtml.replace('<!--og:title-->', bookmark.title);
                finalHtml = finalHtml.replace('<!--og:description-->', bookmark.desc);
                return res.send(finalHtml);    
            })
        }
    }
    return res.send(finalHtml);
  })
});

exports.userView = functions.https.onRequest(app);
