'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendPushNotification = functions.https.onRequest((req, res) => {
  const payload = {
    notification: {
      title: 'You slung a new link',
      body: `http://google.com`
    }
  };

  admin.messaging().sendToDevice([req.query.registrationId], payload).then(function(response) {
    // See the MessagingDevicesResponse reference documentation for
    // the contents of response.
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });

  res.status(200).end();
});