const fbcli = require('firebase-tools');
const fs = require('fs');
fbcli.setup.web().then(config => {
  fs.writeFileSync(
    'public/firebase-config.js',
    `let firebaseConfig = ${JSON.stringify(config)};`
  );
  fs.writeFileSync(
    'src/firebase-config.js',
    `export let firebaseConfig = ${JSON.stringify(config)};`
  );
  fs.writeFileSync(
    'src/config/firebase.js',
    `import firebase from 'firebase/app';firebase.initializeApp(${JSON.stringify(config)});`
  );
});

