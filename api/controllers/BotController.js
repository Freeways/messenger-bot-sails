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
      entry.messaging.forEach(function (message) {
        sendAPI.typingOn(message.sender.id);
        getUser(message.sender, function (err, user) {
          if (err)
            sails.log.error(err);
          sails.log.info(user);
          if (message.message.text)
            Message.create({
              sender: user,
              entry: entry.id,
              message: message.message.text
            }).exec(function (err, message) {
              if (err)
                sails.log.error(err);
              sails.log.info(message);
            });
            /*********************************
             * Implement your bot logic here *
             *********************************/
          sendAPI.typingOff(message.sender.id);
        });
      });
    });
    res.ok();
  },
  authorize: function (req, res) {
    var accountLinkingToken = req.query.account_linking_token;
    var redirectURI = req.query.redirect_uri;
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
            sendAPI.welcome(sender.id);
          cb(err, user);
        });
      } else {
        cb(null, user);
      }
    });
};