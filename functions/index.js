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
//const gcs = require('@google-cloud/storage')();
//const vision = require('@google-cloud/vision')();
const exec = require('child-process-promise').exec;
const nodemailer = require('nodemailer');
const detailView = require('./detailView');
const userView = require('./userView');

// Constant for wall
const fcmKey = 'key';
const messageTemplate = {
                          click_action: "FLUTTER_NOTIFICATION_CLICK", 
                          id: "<Topic ID>",
                          messagelat : "",
                          messagelong : "",
                          status: "done"};
const notificationTemplate = {
                          title: '',
                          body: ''
                          };
const messageOptions = {
                            priority: 'high',
                            timeToLive: 60 * 60 * 24
                          };
const basicUserTemplate = {
    uuid: '',
    user: '',
    avatarUrl: '',
};
const topicTemplate = {
  id: '',
  searchingId: '',
  isShowGeo: true,
  public: false,
  lastUpdate: null,
  created: null,
  createdUser: null,
  imageUrl: '',
  lastUpdateUser: null,
  topic: '',
  content: '',
  tags: ['我地.市正'],
  geobottomright: null,
  geotopleft: null
} 

const chatTemplate = {
    sendMessageTime: null,
    id: '',
    geo: null,
    content: '',
    type: 0,
    createdUser: null,
}

const getChaUserCollectionRef = admin.firestore().collection('getChatUsers');
const chatCollectionRef = admin.firestore().collection('chat');
const topicCollectionRef = admin.firestore().collection('topic');
const sendMessage = admin.messaging();
const effectiveDistance = 1;

// Email Service
const gmailEmail = 'EMAIL_ADDRESS';
const gmailPassword = 'EMAIL_PASSWORD';
const detailUrl = 'https://ourlandtest.firebaseapp.com/detail/';
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

exports.sendFCM = functions.firestore.document('/topic/{topicId}')
  .onWrite((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    let data = change.after.exists? change.after.data(): change.before.data();
    let updateContent = false;
    let newTopic = false;
    let broadcast = false;
    // check for any real update for the content
    if(beforeData === null || beforeData === undefined) {
      newTopic = true;
    } else if(afterData === null) {
      updateContent = true;
    } else if (beforeData.lastUpdate === undefined|| afterData.lastUpdate !== beforeData.lastUpdate) {
      //console.log(`Last update ${afterData.lastUpdate} and ${beforeData.lastUpdate}`);
      updateContent = true;
    }
    if(data.public === true) {
      broadcast = true;
    }

    if(newTopic) {
      let payload = messageTemplate;
      let notification = notificationTemplate;
      payload.id = data.id;
      notification.title = data.topic;
      notification.body = data.content;
      return getChaUserCollectionRef.get().then(snapshot => {
        var fcmTokens = [];
        snapshot.forEach(getChaUserRef => {
          let isSend = false;
          let userProfile = getChaUserRef.data();
          if(!broadcast) {
            // Check for user' address area versus
            if(userProfile.homeAddress !== undefined) {
              isSend = isInsideTopic(data, userProfile.homeAddress)
            }
            if(isSend === false && userProfile.officeAddress !== undefined) {
              isSend = isInsideTopic(data, userProfile.officeAddress)
            }
          } else {
            isSend = true;
          }
          if(isSend) {
            fcmTokens.push(userProfile.fcmToken);
          }
        });
        if(fcmTokens.length != 0) {
          let message = {notification: notification, data: payload};
          return sendMessage.sendToDevice(fcmTokens, message, messageOptions).then(function(response) {
            // See the MessagingDevicesResponse reference documentation for
            // the contents of response.
            console.log('Successfully sent message:', response);
          })
          .catch(function(error) {
            console.log('Error sending message:', error);
          });
        }
      }).catch(err => {
        console.log(`Error getting document ${err}`);
      });
    }
    if(data && updateContent) {
      let payload = messageTemplate;
      let notification = notificationTemplate;
      payload.id = data.id;
      notification.title = data.topic;
      notification.body = data.content;

      var topicId = data.id;
      var topicCreateUserid = data.createdUser.uuid;
      var lastUpdateUserId = data.lastUpdateUser.uuid
      // search chat for those who involved.
      return chatCollectionRef.doc(topicId).collection('messages').get().then(snapshot => {
        var involveUserIds = [topicCreateUserid]; 
        snapshot.forEach(messageRef => {
          let createdUser = messageRef.data().createdUser;
          //console.log(`${createdUser}`);
          //console.log(`${createdUser.uuid}`);
          if(!involveUserIds.includes(createdUser.uuid)) {
            involveUserIds.push(createdUser.uuid);
          }
        });
        return getChaUserProfiles(involveUserIds).then(profiles => {
          if(profiles.length != 0) {
            var fcmTokens = profiles.map(profile => {
              return profile.data().fcmToken;
            });
            let message = {notification: notification, data: payload};
            return sendMessage.sendToDevice(fcmTokens, message, messageOptions).then(function(response) {
              // See the MessagingDevicesResponse reference documentation for
              // the contents of response.
              console.log('Successfully sent message:', response);
            })
            .catch(function(error) {
              console.log('Error sending message:', error);
            });
          }
        });
      });
    }
    return null;
  })

  function getChaUserProfiles(ids) {
    return admin.firestore().getAll(
      [].concat(ids).map(id =>  getChaUserCollectionRef.doc(id))
    );
  }

function isInsideTopic(topic, userAddress) {
  var rv = false;
  if(topic.geobottomright.latitude === topic.geotopleft.latitude &&  topic.geobottomright.longitude === topic.geotopleft.longitude) {
    // for the topic just create
    if(userAddress !== undefined) {
      var dis = distance(topic.geobottomright.longitude, topic.geobottomright.latitude, userAddress.longitude, userAddress.latitude);
      if(dis < effectiveDistance) {
        rv = true;
      }
    }
  } else {
    //TODO // Change the user within the box
    
  }
  return rv;
}

exports.sendEmail = functions.firestore.document('/message/{messageId}')
  .onWrite((change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    let data = change.after.exists? change.after.data(): change.before.data();
    let updateContent = false;
    let newEvent = false;
    // check for any real update for the content
    if(beforeData === null || beforeData === undefined) {
      newEvent = true;
      updateContent = true;
    } else if(afterData === null) {
      updateContent = true;
    } else if (beforeData.lastUpdate === undefined|| afterData.lastUpdate !== beforeData.lastUpdate) {
      //console.log(`Last update ${afterData.lastUpdate} and ${beforeData.lastUpdate}`);
      updateContent = true;
    }

    // add to GetCha Database for new event
    if(newEvent) {
      let indexData = topicTemplate;
      let createdUser = basicUserTemplate;

      createdUser.uuid = data.uid;
      createdUser.user = data.name;
      createdUser.avatarUrl = data.photoUrl;

      indexData.createdUser = createdUser;
      indexData.lastUpdateUser = createdUser;
      indexData.id = data.key;
      indexData.searchingId = data.key;
      indexData.lastUpdate = data.createdAt;
      indexData.created = data.createdAt;
      indexData.imageUrl = data.publicImageURL;
      indexData.topic = detailUrl + data.key;
      indexData.content = data.text + "\n地點: " + data.streetAddress + "\n" + data.desc + "\n" + data.link;
      indexData.geobottomright = data.geolocation;
      indexData.geotopleft = data.geolocation;

      if(data.tagfilter  != null ) {
        for(let key in data.tagfilter) {
          indexData.tags.push(key);
        }
      } 
      let chatData = chatTemplate;
      chatData.created = indexData.created;
      chatData.id = indexData.id;
      chatData.geo = indexData.geobottomright;
      chatData.content = indexData.content;
      chatData.createdUser = indexData.createdUser;
      let indexReference = topicCollectionRef.doc(indexData.id);
      let chatReference = chatCollectionRef.doc(indexData.id).collection("messages").doc(indexData.id);
      indexReference.set(indexData).then(function() {
        console.log("Topic successfully written!");
        chatReference.set(chatData).then(function() {
          console.log("Chat successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });

    }

    if(data && updateContent){
      let messageLongitude = data.geolocation.longitude;
      let messageLatitude = data.geolocation.latitude;
      
       const db = admin.firestore();
        let userRef = db.collection('userProfile');
        let userDoc = userRef.get().then(snapshot => {
          snapshot.forEach(userProfileRef => {
            let userProfile = userProfileRef.data();
            if(receviedNotification(userProfile, data)) {
              let emailAddress = userProfile.emailAddress;
              console.log('UserProfile ID for send email '+ userProfileRef.id);
              // get the home address for send notification
              let sent = false;              
              let addressBookDoc = userRef.doc(userProfileRef.id).collection('AddressBook').get().then(snapshot => {
                snapshot.forEach(addressBook => {
                  let address = addressBook.data();
                  let addressDistance = getAddressDistance(address, userProfile);
                  if(sent === false && addressDistance > 0) {
                    let userAddressGeoLocation = addressBook.data().geolocation;
                    console.log(`email ${emailAddress}, ${userProfile.displayName}, ${data.key}`);
                    if(userAddressGeoLocation.longitude  != null  && userAddressGeoLocation.latitude  != null ){
                      var dis = distance(messageLongitude, messageLatitude, userAddressGeoLocation.longitude, userAddressGeoLocation.latitude);
                      if(dis < addressDistance) {
                        sent = true;
                        return sendEmail(emailAddress, userProfile.displayName, newEvent, address, data);
                      }
                    }
                  }
                })
              })
            }
          });
        }).catch(err => {
          console.log(`Error getting document ${err}`);
        });
    }
   

    return null;
  })

function getAddressDistance(address, userProfile) {
  let addressDistance = 0;
  if(address.geolocation  != null  && (address.type === addressEnum.home || address.type === addressEnum.office)) {
    addressDistance = 1;
    if(address.distance  != null ) {
      addressDistance = address.distance;
    }
    if(userProfile.role === RoleEnum.admin) {
      addressDistance = 100;
    }
  }
  return addressDistance;
}

function receviedNotification(userProfile, message) {
  let rv = false;
  let emailAddress = userProfile.emailAddress;
  if(emailAddress !== undefined && emailAddress  != null ) {
    if(userProfile.role === RoleEnum.admin ||  userProfile.role === RoleEnum.betaUser || userProfile.role === RoleEnum.monitor) {
      rv = true;
    } else if(message.isUrgentEvent  != null  && message.isUrgentEvent) {
      // for any user specified email address and event is urgent
      rv = true;
    } else {
      // check this message contain user interested Tags or not.
      if(userProfile.interestedTags  != null  && userProfile.interestedTags.length> 0) {
      let interestedTags = userProfile.interestedTags;
      let tags = tagfilterToTags(message.tagfilter);
        for(let i=0; i<interestedTags.length; i++) {
            if(tags.includes(interestedTags[i].text)){
                rv =true;
                break;
            }
        }
      }
    }
  }
return rv;
}  

function sendEmail(email, displayName, newEvent, address, message) {
  const eventId = message.key
  let text = `您好 ${displayName || ''}! 閣下關注${address.text}附近的社區事件 ${message.text} 有新發展. 詳細請瀏覽以下連結: https://ourland.hk/detail/${eventId}`;
  if(newEvent) {
    text = `您好 ${displayName || ''}! 閣下關注${address.text}附近的社區有新事件 ${message.text} 詳細請瀏覽以下連結: https://ourland.hk/detail/${eventId}`;
  }

  if(message.isUrgentEvent  != null  && message.isUrgentEvent) {
     text = `您好 ${displayName || ''}! 閣下關注${address.text}附近的社區有事件 ${message.text} 被列為緊急事件 詳細請瀏覽以下連結: https://ourland.hk/detail/${eventId}`;
  }

  const mailOptions = {
    to: email,
    subject: `${APP_NAME} 通知`,
    text: text
  };

  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Email sent to:', email);
  });
}

// support function for send mail

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

function tagfilterToTags(tagfilter) {
  let rv = [];
  if(tagfilter  != null ) {
      for(let key in tagfilter) {
          rv.push(key);
      }
  }
  return rv;
}


if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}


// Checks if uploaded images are flagged as Adult or Violence and if so blurs them.
exports.blurOffensiveImages = functions.storage.object().onFinalize((object) => {
  const image = {
    source: {imageUri: `gs://${object.bucket}/${object.name}`},
  };

  // Check the image content using the Cloud Vision API.
  return vision.safeSearchDetection(image).then((batchAnnotateImagesResponse) => {
    const safeSearchResult = batchAnnotateImagesResponse[0].safeSearchAnnotation;
    const Likelihood = Vision.types.Likelihood;
    if (Likelihood[safeSearchResult.adult] >= Likelihood.LIKELY ||
        Likelihood[safeSearchResult.violence] >= Likelihood.LIKELY) {
      console.log('The image', object.name, 'has been detected as inappropriate.');
      return blurImage(object.name);
    }
    console.log('The image', object.name, 'has been detected as OK.');
    return null;
  });
});

// Blurs the given image located in the given bucket using ImageMagick.
function blurImage(filePath) {
  const tempLocalFile = path.join(os.tmpdir(), path.basename(filePath));
  const messageId = filePath.split(path.sep)[1];
  const bucket = admin.storage().bucket();

  // Download file from bucket.
  return bucket.file(filePath).download({destination: tempLocalFile}).then(() => {
    console.log('Image has been downloaded to', tempLocalFile);
    // Blur the image using ImageMagick.
    return spawn('convert', [tempLocalFile, '-channel', 'RGBA', '-blur', '0x24', tempLocalFile]);
  }).then(() => {
    console.log('Image has been blurred');
    // Uploading the Blurred image back into the bucket.
    return bucket.upload(tempLocalFile, {destination: filePath});
  }).then(() => {
    console.log('Blurred image has been uploaded to', filePath);
    // Deleting the local file to free up disk space.
    fs.unlinkSync(tempLocalFile);
    console.log('Deleted local file.');
    // Indicate that the message has been moderated.
    return null
//    return admin.database().ref(`/messages/${messageId}`).update({moderated: true});
  }).then(() => {
    console.log('Marked the image as moderated in the database.');
    return null;
  });
}

exports.detailView = detailView.detailView;
exports.userView = userView.userView;
