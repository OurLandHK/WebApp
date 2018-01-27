import './firebase';

let config = {
  fbApp: {
  	appId: '640276812834634',
    cookie: true,
    xfbml: true,
    version: 'v2.10'
  },
  // fbGroupId: '244493866025075', // Production https://www.facebook.com/groups/OurLandHK/?fref=nf
  // messageDB: 'messages', // Production
  // userDB: 'userProfile' // Production

  fbGroupId: '264191847414716', // For Development https://www.facebook.com/groups/264191847414716/ 
  messageDB: 'messageTest', // For development.
  concernDB: 'concernMessagesTest' , // For development.
  userDB: 'userProfileTest' // For developments.
};


export default config;
