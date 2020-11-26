const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceaccount-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://vizuau-6f075.firebaseio.com"
});

export default admin;