# OurLand

This folder contains the final prototype code

Please follow below step to setup
1. Create a Firebase project and Facebook App and Set up your app
	A. Create project - In the Firebase console click on CREATE NEW PROJECT and call it OurLand
	B. Enable Auth
		- To let users sign-in on the web app we'll use Facebook auth currently, which needs to be enabled.
		- Follow this guide to setup Facebook App https://firebase.google.com/docs/auth/web/facebook-login		
		- In the Firebase Console open the Authentication section > SIGN IN METHOD tab (click here to go there) you need to enable the Facebook Sign-in Provider and click SAVE. This will allow users to sign-in the Web app with their Facebook accounts


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
