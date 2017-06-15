# OurLand

This folder contains the final prototype code

Please follow below step to setup
1. Create a Firebase project and Set up your app
	A. Create project - In the Firebase console click on CREATE NEW PROJECT and call it OurLand
	B. Enable Auth
		- To let users sign-in on the web app we'll use Google auth currently, which needs to be enabled.
		- In the Firebase Console open the Authentication section > SIGN IN METHOD tab (click here to go there) you need to enable the Google Sign-in Provider and click SAVE. This will allow users to sign-in the Web app with their Google accounts
		- ToDo for Facebook later

2. Install the Firebase Command Line Interface
	A. Install Node.js
	B. Install Firebase 
		- npm -g install firebase-tools
		- firebase login
		- Change the folder to WebApp and type "firebase use --add"
		- Change the folder to function for install firebase cloud package and type "npm install"
		- Deploy it type firebase deploy
	C. Test your WebApp
		https://<project-id>.firebaseapp.com
