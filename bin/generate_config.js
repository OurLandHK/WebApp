const fbcli = require('firebase-tools');
const fs = require('fs');
fbcli.setup.web().then(config => {
  fs.writeFileSync(
    'public/firebase-config.js',
    `let firebaseConfig = ${JSON.stringify(config)};`
  );
  fs.writeFileSync(
    'src/config/firebase.js',
    `import * as firebase from 'firebase';firebase.initializeApp(${JSON.stringify(config)});`
  );
});

