'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendPushNotification = functions.https.onRequest((req, res) => {
  const payload = {
    notification: {
      url: req.query.url
    }
  };

  admin
    .database()
    .ref("users/" + req.query.uid + "/readerDevices/")
    .once("value", function(result) {
      if(result.val()){
        var deviceTokens = Object
                            .keys(result.val())
                            .map(function (instanceId) {
                              return result.val()[instanceId].notificationToken;
                            });

        admin.messaging().sendToDevice(deviceTokens, payload).then(function(response) {
          console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
          console.log("Error sending message:", error);
        });


      }
    });
  res.status(200).end();
});