'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const validUrl = require('valid-url');

admin.initializeApp(functions.config().firebase);


exports.sendPushNotification = functions.https.onRequest((req, res) => {

  if (validUrl.isUri(req.query.url)){
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

          admin.messaging().sendToDevice(
            deviceTokens, {
              notification: {
                url: req.query.url,
                title: "Link from Sling"
              }
            }
          ).then(function(response) {
            console.log("Successfully sent message:", response);
          }).catch(function(error) {
            console.log("Error sending message:", error);
          });
        }
      });    
  } else {
    console.log('URL invalid', req.query.url)
  }
  res.status(200).end();
});