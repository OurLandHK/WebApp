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

const RoleEnum = {
  user: "用戶",
  betaUser: "測試用戶",
  monitor: "監察員",
  admin: "我地管理員", 
}

const addressEnum = {
  home: "住宅",
  office: "辦工室",
  other: "其他"
}


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
        let userRef = db.collection('userProfile');
        let userDoc = userRef.get().then(snapshot => {
          snapshot.forEach(userProfile => {
            let emailAddress = userProfile.data().emailAddress;
            if(emailAddress != undefined && emailAddress != null) {
              if(userProfile.role == RoleEnum.admin ||  userProfile.role == RoleEnum.betaUser || userProfile.role == RoleEnum.monitor) {
                console.log('UserProfile ID for send email '+ userProfile.id);
                let addressBookDoc = userRef.doc(userProfile.id).collection('AddressBook').get().then(snapshot => {
                  snapshot.forEach(addressBook => {
                    let address = addressBook.data();
                    if(address.geolocation != null && (address.type == addressEnum.home || address.type == addressEnum.office)) {
                      let addressDistance = constant.distance;
                      if(address.distance != null) {
                        addressDistance = address.distance;
                      }
                      if(user.userProfile.role == RoleEnum.admin) {
                        addressDistance = 100;
                      }
                      let userAddressGeoLocation = addressBook.data().geolocation;
                      console.log(`email ${emailAddress}, ${userProfile.displayName}, ${data.key}`);
                      if(userAddressGeoLocation.longitude != null && userAddressGeoLocation.latitude != null){
                        var dis = distance(messageLongitude, messageLatitude, userAddressGeoLocation.longitude, userAddressGeoLocation.latitude);
                        if(dis < addressDistance) {
                          return sendEmail(emailAddress, userProfile.displayName, data.key);
                        }
                      }
                    }
                  })
                })
              }
            }
          });
        }).catch(err => {
          console.log(`Error getting document ${err}`);
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

// Checks if uploaded images are flagged as Adult or Violence and if so blurs them.
exports.blurOffensiveImages = functions.storage.object().onChange(event => {
  const object = event.data;
  // Exit if this is a deletion or a deploy event.
  if (object.resourceState === 'not_exists') {
    return console.log('This is a deletion event.');
  } else if (!object.name) {
    return console.log('This is a deploy event.');
  }

  const bucket = gcs.bucket(object.bucket);
  const file = bucket.file(object.name);

  // Check the image content using the Cloud Vision API. 
  return vision.detectSafeSearch(file).then(safeSearchResult => {
    if (safeSearchResult[0].adult || safeSearchResult[0].violence) {
      console.log('The image', object.name, 'has been detected as inappropriate.');
      return blurImage(object.name, bucket);
    } else {
      console.log('The image', object.name,'has been detected as OK.');
    }
  });
});

// Blurs the given image located in the given bucket using ImageMagick.
function blurImage(filePath, bucket) {
  const fileName = filePath.split('/').pop();
  const tempLocalFile = `/tmp/${fileName}`;
  const messageId = filePath.split('/')[1];

  // Download file from bucket.
  return bucket.file(filePath).download({destination: tempLocalFile})
      .then(() => {
        console.log('Image has been downloaded to', tempLocalFile);
        // Blur the image using ImageMagick.
        return exec(`convert ${tempLocalFile} -channel RGBA -blur 0x24 ${tempLocalFile}`);
      }).then(() => {
        console.log('Image has been blurred');
        // Uploading the Blurred image back into the bucket.
        return bucket.upload(tempLocalFile, {destination: filePath});
      }).then(() => {
        console.log('Blurred image has been uploaded to', filePath);
        // Indicate that the message has been moderated.
//        return admin.database().ref(`/messages/${messageId}`).update({moderated: true});
      }).then(() => {
        console.log('Marked the image as moderated in the database.');
      });
}

