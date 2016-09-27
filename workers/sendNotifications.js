const redis = require('../db/redis.js');
const TWILIO_ACCOUNT_SID='AC3048e56f3fdb1b43fa286a27cdce3b68';
const TWILIO_AUTH_TOKEN='ae81e25530532c5fed33d516de4b5c26';
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
function sendNotifications() {
  redis.lrangeAsync(["notificationList", 0, -1]).then( reminders => {
    //We're gonna loop through the number of reminders in the queue, but we're not using the reminders we got back from the queue
    for (var i = 0; i < reminders.length; i++) {
      //This operation pulls one out of the queue, so that if we have multiple processes working on the same queue we need to only operate on messages that have not already been removed from the queue.
      redis.lpop(['notificationList'], (err, notification) => {
        if (err) console.log(err);
        if (!notification) process.exit(0); //if multiple workers are processing the queue, we will eventually get null values - in that case, stop.
        let notificationObj = JSON.parse(notification);

        if (notificationObj.user.cellNum) {
          console.log('cellNum: ' + notificationObj.user.cellNum.replace(/-/g, ''))

          client.messages.create({
              to:'+1' + notificationObj.user.cellNum.replace(/-/g, ''), // Any number Twilio can deliver to
              from: '+15005550006', // A number you bought from Twilio and can use for outbound communication
              body: `Hi ${notificationObj.user.firstName}, ${notificationObj.release.artist} has a new release ${notificationObj.release.name}. Check it out: ${notificationObj.release.link} . Cheers from musiCatch.` // body of the SMS message
              // mediaUrl: notificationObj.release.coverArt
          }, (err, responseData) => { //this function is executed when a response is received from Twilio

              if (!err) { // "err" is an error received during the request, if any

                  // "responseData" is a JavaScript object containing data received from Twilio.
                  // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                  // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                  console.log('responseData.from: ' + JSON.stringify(responseData.from)); // outputs "+14506667788"
                  console.log('responseData.body: ' + JSON.stringify(responseData.body)); // outputs "word to your mother."

              } else {
                console.log(err);
              }
          });
        }

      });

    }
  });
}


module.exports = {
  sendNotifications: () => {
    sendNotifications();
  }
};
