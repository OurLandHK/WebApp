/**

 */
'use strict';

// Initializes OurLand.
function OurLand() {
  this.checkSetup();

  // Shortcuts to DOM Elements.
  this.messageList = document.getElementById('messages');
  this.messageForm = document.getElementById('message-form');
  this.messageInput = document.getElementById('message');
  this.latitude = document.getElementById('latitude');
  this.longitude = document.getElementById('longitude');
  this.locationButton = document.getElementById('location');

  this.submitImageButton = document.getElementById('submitImage');
  this.imageForm = document.getElementById('image-form');
  this.mediaCapture = document.getElementById('mediaCapture');
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.signInSnackbar = document.getElementById('must-signin-snackbar');

  this.latitude.setAttribute('hidden', 'true');
  this.longitude.setAttribute('hidden', 'true');
  this.submitImageButton.setAttribute('disabled', 'true');

  // Saves message on form submit.
  this.locationButton.addEventListener('click', this.getLocation.bind(this));
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  // Toggle for the button.
  var buttonTogglingHandler = this.toggleButton.bind(this);
  this.messageInput.addEventListener('keyup', buttonTogglingHandler);
  this.messageInput.addEventListener('change', buttonTogglingHandler);

  // Events for image upload.
  this.submitImageButton.addEventListener('click', function(e) {
    e.preventDefault();
    this.mediaCapture.click();
  }.bind(this));
  this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

  this.initFirebase();
  this.getLocation(null);
  setInterval(this.getLocation(null), 10000);
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
OurLand.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  this.storage = firebase.storage();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Loads chat messages history and listens for upcoming ones.
OurLand.prototype.loadMessages = function() {
  // Reference to the /messages/ database path.
  this.messagesRef = this.database.ref('messages');
  // Make sure we remove all previous listeners.
  this.messagesRef.off();

  // Loads the last 12 messages and listen for new ones.
  var setMessage = function(data) {
    var val = data.val();
    this.displayMessage(data.key, val.name, val.text, val.photoUrl, val.imageUrl, val.latitude, val.longitude);
  }.bind(this);
  this.messagesRef.limitToLast(12).on('child_added', setMessage);
  this.messagesRef.limitToLast(12).on('child_changed', setMessage);
};

// getLocation
OurLand.prototype.getLocation = function(e) {
  console.log('Your current position is:');
    if(navigator.geolocation) {
     var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }; 
      var count = 0
      navigator.geolocation.getCurrentPosition(this.getGeoSuccess, this.getGeoError, options);
    } else {
      console.error('There was an error no geo location');
      this.locationButton.setAttribute('disabled', 'true');
    }
};

OurLand.prototype.getGeoSuccess = function(pos) {
  console.log('Your current position is:');
  console.log('Latitude : ' + pos.coords.latitude);
  console.log('Longitude: ' + pos.coords.longitude);
  console.log('More or less ' + pos.coords.accuracy + 'meters.');  
  document.getElementById('latitude').value = pos.coords.latitude;
  document.getElementById('longitude').value = pos.coords.longitude;   
};

OurLand.prototype.getGeoError = function(err) {
  console.warn('ERROR(${err.code}): ${err.message}');
};

// Sets the URL of the given img element with the URL of the image stored in Firebase Storage.
OurLand.prototype.setImageUrl = function(imageUri, imgElement) {
  // If the image is a Firebase Storage URI we fetch the URL.
  if (imageUri.startsWith('gs://')) {
    imgElement.src = OurLand.LOADING_IMAGE_URL; // Display a loading image first.
    this.storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
      imgElement.src = metadata.downloadURLs[0];
    });
  } else {
    imgElement.src = imageUri;
  }
  this.updateGeo = true;
};


// Saves a new message containing an image URI in Firebase.
// This first saves the image in Firebase storage.
OurLand.prototype.saveImageMessage = function(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  this.imageForm.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      message: 'You can only share images',
      timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return;
  }

  // Check if the user is signed-in
  if (this.checkSignedInWithMessage() && this.messageInput.value) {
    var fbpost = "https://www.facebook.com/groups/OurLandHK/permalink/FeedID";
    var currentUser = this.auth.currentUser;       
    this.messagesRef.push({
      name: currentUser.displayName,
      imageUrl: OurLand.LOADING_IMAGE_URL,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png',
      latitude: this.latitude.value,
      longitude: this.longitude.value,
      fbpost: 'fbpost'
    }).then(function(data) {

      // Upload the image to Firebase Storage.
      var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
      return this.storage.ref(filePath).put(file).then(function(snapshot) {

        // Get the file's Storage URI and update the chat message placeholder.
        var fullPath = snapshot.metadata.fullPath;
        return data.update({imageUrl: this.storage.ref(fullPath).toString()}).then(function() {
          // Post Image
          var fbpostmessage = this.messageInput.value + "\nGeo ("+ this.longitude.value + "," + this.latitude.value + ")\n#Testing";
          var imagePublicURL = "no update"
          this.storage.ref(fullPath).getDownloadURL().then(function(url) {
            imagePublicURL = url;
            console.log('imagePublicURL: ' + imagePublicURL);
/*            var fbpostURL = this.facebookPost(imagePublicURL, fbpostmessage);
            if(null != fbpostURL)
            {
              return data.update({fbpost: fbpost});
            }
*/            
            
            FB.login(function(){
              // Note: The call will only work if you accept the permission request
              FB.api(
             //   '/244493866025075/feed', 
                '/244493866025075/photos',
                'post', 
                {
                    url: imagePublicURL,
                    message: fbpostmessage
                },
                function (response) {
                  if (response && !response.error) {
                    console.log('Post ID: ' + response.id);
                    var fbfeedpost = "https://www.facebook.com/groups/OurLandHK/permalink/" + response.id.split("_")[1];
                    var fbphotopost = "https://www.facebook.com/photo.php?fbid=" + response.id;
                    fbpost = fbphotopost;
                    console.log('URL: ' + fbpost);
                  } else {
                    console.log('Error:' + response.error.message + ' code ' + response.error.code);
                    console.log(fbpostmessage);
                  }
                  return data.update({fbpost: fbpost});
                }           
              );              
            }, {scope: 'publish_actions,user_managed_groups'});
          });
        }.bind(this));
      }.bind(this));
    }.bind(this)).catch(function(error) {
      console.error('There was an error uploading a file to Firebase Storage:', error);
    });
    this.messageInput.value = null;
/*
    })
    .then(function(){
      this.messageInput.value = null;
    }
    );
*/  
  }
};
/*
OurLand.prototype.facebookPost = function(imageUrl, fbpostmessage) {
  var fbpost = ""; 
  if(imageUrl != null) {
    console.log('imagePublicURL: ' + imageUrl);
    FB.login(function(){
    // Note: The call will only work if you accept the permission request
      FB.api(
        '/244493866025075/photos',
        'post',         
        {
            url: imageUrl,
            message: fbpostmessage
        },
        function (response) {
          if (response && !response.error) {
            console.log('Post ID: ' + response.id);
            fbpost = fbphotopost = "https://www.facebook.com/photo.php?fbid=" + response.id;
            console.log('URL: ' + fbpost);
          } else {
            console.log('Error:' + response.error.message + ' code ' + response.error.code);
          }
          return fbpost;
        }           
      );
    }, {scope: 'publish_actions,user_managed_groups'});
  } else  {
    FB.login(function(){
    // Note: The call will only work if you accept the permission request
      FB.api(
      '/244493866025075/feed', 
      'post', 
      {
          message: fbpostmessage
      },
      function (response) {
        if (response && !response.error) {
          console.log('Post ID: ' + response.id);
          var fbfeedpost = "https://www.facebook.com/groups/OurLandHK/permalink/" + response.id.split("_")[1];
          var fbphotopost = "https://www.facebook.com/photo.php?fbid=" + response.id;
          fbpost = fbphotopost;
          console.log('URL: ' + fbpost);
        } else {
          console.log('Error:' + response.error.message + ' code ' + response.error.code);
        }
        return fbpost;
      }           
    );
  }, {scope: 'publish_actions,user_managed_groups'});
  return fbpost;
  }
}
*/
// Signs-in Our Land.
OurLand.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  // var provider = new firebase.auth.GoogleAuthProvider();
  // Sign in Firebase using popup auth and Facebook as the identity provider.  
  var provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScope('email');
  provider.addScope('publish_actions');
  //provider.addScope('user_managed_groups')
  this.auth.signInWithPopup(provider).then(function(result) {
    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });;
};

// Signs-out of Our Land.
OurLand.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
OurLand.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL;
    var userName = user.displayName;

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + (profilePicUrl || '/images/profile_placeholder.png') + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

    // We load currently existing chant messages.
    this.loadMessages();

    // We save the Firebase Messaging Device token and enable notifications.
    this.saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};

// Returns true if user is signed-in. Otherwise false and displays a message.
OurLand.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (this.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};

// Saves the messaging device token to the datastore.
OurLand.prototype.saveMessagingDeviceToken = function() {
  firebase.messaging().getToken().then(function(currentToken) {
    if (currentToken) {
      console.log('Got FCM device token:', currentToken);
      // Saving the Device Token to the datastore.
      firebase.database().ref('/fcmTokens').child(currentToken)
          .set(firebase.auth().currentUser.uid);
    } else {
      // Need to request permissions to show notifications.
      this.requestNotificationsPermissions();
    }
  }.bind(this)).catch(function(error){
    console.error('Unable to get messaging token.', error);
  });
};

// Requests permissions to show notifications.
OurLand.prototype.requestNotificationsPermissions = function() {
  console.log('Requesting notifications permission...');
  firebase.messaging().requestPermission().then(function() {
    // Notification permission granted.
    this.saveMessagingDeviceToken();
  }.bind(this)).catch(function(error) {
    console.error('Unable to get permission to notify.', error);
  });
};

// Resets the given MaterialTextField.
OurLand.resetMaterialTextfield = function(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};

// Template for messages.
OurLand.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// A loading image URL.
OurLand.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

// Displays a Message in the UI.
OurLand.prototype.displayMessage = function(key, name, text, picUrl, imageUri, latitude, longitude) {
  var div = document.getElementById(key);
  // If an element for that message does not exists yet we create it.
  if (!div) {
    var container = document.createElement('div');
    container.innerHTML = OurLand.MESSAGE_TEMPLATE;
    div = container.firstChild;
    div.setAttribute('id', key);
    this.messageList.appendChild(div);
  }
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
  }
  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');
  messageElement.innerHTML = '';
  if(this.latitude) { // if geo location exist
    messageElement.textContent = messageElement.textContent + 'Geo: (' + latitude + ',' + longitude + ')\n';
  }
  if (text) { // If the message is text.
    messageElement.textContent = messageElement.textContent + 'Summary: ' + text + '\n';
  } 
     // Replace all line breaks by <br>. 
  messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>'); 
  if (imageUri) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }.bind(this));
    this.setImageUrl(imageUri, image);    
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  this.messageList.scrollTop = this.messageList.scrollHeight;
  this.messageInput.focus();
};

// Enables or disables the submit button depending on the values of the input
// fields.
OurLand.prototype.toggleButton = function() {
  if (this.messageInput.value) {
    this.submitImageButton.removeAttribute('disabled');
  } else {
    this.submitImageButton.setAttribute('disabled', 'true');
  }
};

// Checks that the Firebase SDK has been correctly setup and configured.
OurLand.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }

  function updatePermission(name, state) {
    console.log('update permission for ' + name + ' with ' + state);
  }

  navigator.permissions.query({name:'geolocation'}).then(function(p) {
    updatePermission('geolocation', p.state);
      p.onchange = function() {
        updatePermission('geolocation', this.state);
      };
  });

  // Check for Notifications API permissions
  navigator.permissions.query({name:'notifications'}).then(function(p) {
    updatePermission('notifications', p.state);
    p.onchange = function() {
      updatePermission('notifications', this.state);
    };
  });  
};

window.onload = function() {

  window.ourLand = new OurLand();
};
