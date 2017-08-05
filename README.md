# OurLand

This folder contains the final prototype code

## Project Setup
1. Create a Firebase project and Facebook App and Set up your app
    * Create project
        * In the Firebase console click on CREATE NEW PROJECT and call it OurLand
    * Enable Auth
		* To let users sign-in on the web app we'll use *Facebook* auth currently, which needs to be enabled.
		* Follow this guide to setup Facebook App https://irebase.google.com/docs/auth/web/facebook-login		
		* In the Firebase Console open the Authentication section > SIGN IN METHOD tab (click here to go there) you need to enable the Facebook Sign-in Provider and click SAVE. This will allow users to sign-in the Web app with their Facebook accounts


2. Install the Firebase Command Line Interface
    * Install Node.js https://nodejs.org/en/
    * Install Firebase `npm -g install firebase-tools`
    * Install create-react-app `npm install -g create-react-app`
    * Install the following peer Dependencies
        * `npm install react-tap-event-plugin`
		* `npm install --save react-tag-input`
    * Checkout the source code and run the following commands
		```bash
		firebase login
		cd WebApp
        npm install
		firebase use --add
		npm run generate_firebase_config
		npm run start
	    ```
	* Deployment
	   ```bash
        npm run build
		(cd functions; npm install)
		firebase deploy #Deployment
	   ```
3. Test your WebApp
	*   Go to https://`<project-id>`.firebaseapp.com
