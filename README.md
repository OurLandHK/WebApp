# OurLand

Ourland Searching is a Neighbour Media Web Application where neighbours could browse community affairs within 1 - 3 kilometers based on the current location, filter their interested posts, and participate in some affairs related to public facilities, community activities or social issues.

## Coding Styling
Please refer to following guide for any new / modified code:
https://google.github.io/styleguide/jsguide.html

## Features
1. Browse
  * List out nearby community affairs based on users' current location
2. User Profile
  * List out all affairs that users' have published and have been involved in
3. Publish
  * Publish community affairs such as social issues, resources, or activities
4. Involve
  * Get involved in resolving community affairs or vote on social issues
5. Notification
  * Push latest notifications such as RunOurCity or planned changes to bus routes to users' home addresses or office addresses

## Project Setup
1. Create a Firebase project and Facebook App and setup your application
  * Add a project
      * Go to Firebase: https://console.firebase.google.com
      * Click on Add Project
      * Input project name as OurLand > Leave anything default > Accept controller-controller terms > Create Project
  * Enable Authentication
  		* To let users sign-in on the web app we'll use *Facebook* auth currently, which needs to be enabled.
  		* Follow this guide to setup Facebook App: https://firebase.google.com/docs/auth/web/facebook-login		
  		* In the Firebase Console open the Authentication section > SIGN IN METHOD tab you need to enable the Facebook Sign-in Provider and click SAVE. This will allow users to sign-in the Web app with their Facebook accounts
	* Restore Database
		* Install firestore-back-restore: https://www.npmjs.com/package/firestore-backup-restore
		* Retrieving Google Cloud Account Credentials with above link and put into path/to/restore/credentials/file.json
		* Extract the sample/sampledb.zip into ./backups/myDatabase
		* Run `firestore-backup-restore --backupPath ./backups/myDatabase --restoreAccountCredentials path/to/restore/credentials/file.json`


2. Install the Firebase Command Line Interface (**For Windows, please use Powershell with administrator privileges**)
    * Install Node.js: https://nodejs.org/en/
	  * Install windows-build-tools on Windows environment: `npm install --global --production windows-build-tools`
    * Checkout the source code
    * Install project dependencies
      ```bash
      cd WebApp
      npm install
      cd functions
  		npm install
      ```
    * Setup firebase configuration
  		```bash
  		cd ..
  		firebase login
  		firebase use --add
  		npm run generate_firebase_config
	    ```
    * Build the project
      ```bash
      npm run build
      serve -s build
      ```
    * Deploy the project
      ```bash
      npm run build
      (cd functions; npm install)
      firebase deploy
      ```
3. Test your project
	*   Go to https://`<project-id>`.firebaseapp.com
