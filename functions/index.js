/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const gcs = require('@google-cloud/storage')();
//const vision = require('@google-cloud/vision')();
const exec = require('child-process-promise').exec;
const nodemailer = require('nodemailer');

// Email Service

const gmailEmail = 'EMAIL_ADDRESS';
const gmailPassword = 'EMAIL_PASSWORD';
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const APP_NAME = '我地';

exports.sendEmail = functions.firestore.document('/message/{messageId}')
  .onWrite((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    var data = change.after.exists? change.after.data(): change.before.data();

    if(data){
      let messageLongitude = data.geolocation.longitude;
      let messageLatitude = data.geolocation.latitude;
      
       const db = admin.firestore();
        var userRef = db.collection('userProfile');
        var userDoc = userRef.get().then(snapshot => {
          snapshot.forEach(user => {
            let addressBookDoc = userRef.doc(user.id).collection('AddressBook').get().then(snapshot => {
              snapshot.forEach(addressBook => {
                var userAddressGeoLocation = addressBook.data().geolocation;
                var dis = distance(messageLongitude, messageLatitude, userAddressGeoLocation.longitude, userAddressGeoLocation.latitude);
                if(dis < 1) {
                   return sendEmail(user.data().emailAddress, user.data().displayName, data.key);
                }
              })
            })
          });
        }).catch(err => {
          console.log('Error getting document', err);
        });
    }
   

    return null;
  })


function sendEmail(email, displayName, eventId) {
  const mailOptions = {
    to: email,
    subject: `${APP_NAME} 通知`,
    text: `您好 ${displayName || ''}! 以下為1公里範圍社區事件: https://ourland.hk/?eventid=${eventId}`
  };

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Email sent to:', email);
  });
}

function distance(lon1, lat1, lon2, lat2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
    var dLon = (lon2-lon1).toRad(); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}