/**
 * BotController
 *
 * @description :: Server-side logic for managing bots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sendAPI = require('../utils/sendAPI');

module.exports = {
  subscribe: function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === sails.config.parameters.validationToken) {
      sails.log.info("Validating webhook");
      res.ok(req.query['hub.challenge']);
    } else {
      sails.log.error("Failed validation. Make sure the validation tokens match.");
      res.forbidden({err: "Failed validation. Make sure the validation tokens match."});
    }
  },
  handleMessage: function (req, res) {
    var data = req.allParams();
    data.entry.forEach(function (entry) {
      entry.messaging.forEach(function (messaging) {
        //Uncomment to display the famous typing 3 dots to the user until your bot reply
        //sendAPI.typingOn(message.sender.id, function (m) {
        //  return;
        //});
        getUser(messaging.sender, function (err, user) {
          if (err)
            sails.log.error(err);
          if (messaging.message) {
            // Comment the create function if you do not want to save messages
            Message.create({
              sender: user,
              entry: entry.id,
              message: messaging.message.text,
              attachement: messaging.message.attachement
            }).exec(function (err, message) {
              if (err)
                sails.log.error(err);
              /*
               * Implement your message recieved bot logic here
               * The message is either a text or an attachement
               * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received 
               */
            });
          } else if(messaging.postback) {
            /*
             * Postback Event
             *
             * This event is called when a postback is tapped on a Structured Message. 
             * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
             * 
             */
            
            /* 
             * Create a response object
             * https://developers.facebook.com/docs/messenger-platform/send-api-reference
             */
            var responseMessage = {};
            return sendAPI.send(responseMessage, function(err, botResponse){
              if (err)
                sails.log.error(err);
              /*
               * Anything put here executes after sending the response.
               * The sent response is on the botResponse Object
               */
            });
          } else if(messaging.optin) {
            /*
             * Authorization Event
             *
             * The value for 'messaging.optin.ref' is defined in the entry point.
             * For the "Send to Messenger" plugin, it is the 'data-ref' field. 
             * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
             *
             */
            return;
          } else if(messaging.delivery) {
            /*
             * Delivery Confirmation Event
             *
             * This event is sent to confirm the delivery of a messaging.
             * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
             *
             */
            return;
          } else if(messaging.read) {
            /*
             * Message Read Event
             *
             * This event is called when a previously-sent message has been read.
             * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
             * 
             */
            return;
          } else if(messaging.account_linking) {
            /*
             * Account Link Event
             *
             * This event is called when the Link Account or UnLink Account action has been tapped.
             * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
             * 
             */
            return;
          } else
            sails.log.error("unknow message type recieved: " + messaging);
        });
      });
    });
    res.ok();
  },
  authorize: function (req, res) {
    var accountLinkingToken = req.query.account_linking_token;
    var redirectURI = req.query.redirect_uri;
    // authCode must be a generated unique string
    var authCode = "1234567890";
    var redirectURISuccess = redirectURI + "&authorization_code=" + authCode;

    res.render('authorize', {
      accountLinkingToken: accountLinkingToken,
      redirectURI: redirectURI,
      redirectURISuccess: redirectURISuccess
    });
  }
};

getUser = function (sender, cb) {
  if (!sender)
    cb('can not find sender', null);
  User.findOne({fbId: sender.id})
    .exec(function (err, user) {
      if (err)
        cb(err, null);
      if (!user) {
        User.createFromFb(sender.id, function (err, user) {
          if (!err)
            sendAPI.welcome(user, function (message) {
              sendAPI.typingOff(user, function (message) {
                cb(err, user);
              });
            });
        });
      } else {
        cb(null, user);
      }
    });
};