/**
 * BotController
 *
 * @description :: Server-side logic for managing bots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sendAPI = require('../utils/sendAPI');

var fallback = function (err, info) {
  sails.log.info(new Date());
  if (err)
    return sails.log.error(err);
  return sails.log.info(info);
};
var reportError = function (user, err) {
  if (err) {
    sails.log.error(err);
    return sendAPI.reportError(user, err, fallback);
  }
};

var unreconizedCall = function (user, type, value) {
  sails.log.warn("Recieved unkown `" + type + "`:");
  sails.log.info(value);
};

module.exports = {
  subscribe: function (req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === sails.config.parameters.validationToken) {
      sails.log.info("Validating webhook");
      res.ok(req.query['hub.challenge']);
    } else {
      sails.log.error("Failed validation. Make sure the validation tokens match.");
      res.forbidden({ err: "Failed validation. Make sure the validation tokens match." });
    }
  },
  webhook: function (req, res) {
    var data = req.allParams();
    data.entry.forEach(function (entry) {
      entry.messaging.forEach(function (messaging) {
        getUser(messaging.sender, function (err, user) {
          if (err)
            return sails.log.error(err);
          if (messaging.message) {
            // The boilerplate save all messages by default
            return Message.create({
              sender: user,
              entry: entry.id,
              message: messaging.message.text,
              attachments: messaging.message.attachments,
              payload: messaging.message.quick_reply.payload
            }).exec(function (err, message) {
              if (err)
                return sails.log.error(err);
              if (message.payload)
                return handlePayload(user, message.payload);
              if (message.text)
                return handleMessage(user, message.text);
              if (message.attachments)
                return handleAttachments(user, message.attachments);
              return unreconizedCall(user, "messaging.message", message);
            });
          } else if (messaging.postback) {
            return handlePayload(user, messaging.postback.payload);
          } else if (messaging.delivery) {
            return handleDelivery(user, messaging.delivery);
          } else if (messaging.read) {
            return handleRead(user, messaging.read);
          } else
            return unreconizedCall(user, "messaging", messaging);
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
  User.findOne({ fbId: sender.id })
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

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
handlePayload = function (user, payload) {
  // case of with parses
}
/*
 * Implement your message recieved bot logic here
 * The message is either a text or an attachement
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received 
 */
handleMessage = function (user, text) {
  // case of with wit.ai here
}

handleAttachments = function (user, attachments) {
  // loop attachement
}
/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a messaging.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
handleDelivery = function (user, delivery) {
  sails.log.info("Message delivered to: " + user.first_name + " " + user.last_name + " at " + new Date().toDateString());
}
/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
handleRead = function (user, read) {
  sails.log.info("Message read by: " + user.first_name + " " + user.last_name + " at " + new Date().toDateString());
}