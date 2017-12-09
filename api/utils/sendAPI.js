var https = require('https');

module.exports = {
  send: function (messageData, cb) {
    messageData.access_token = sails.config.messenger.pageAccessToken;
    var data = JSON.stringify(messageData);
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/' + sails.config.messenger.fbApiVersion + '/me/messages',
      qs: { access_token: sails.config.messenger.pageAccessToken },
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    var req = https.request(options, function (res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var message = JSON.parse(body);
        if (!message)
          return cb('error while parsing json response, response was : ' + body, null);
        if (message.error)
          return cb(message, null);
        return cb(null, message);
      });
    });
    req.on('error', function (err) {
      return sails.log.error(err);
    });
    req.write(data);
    req.end();
  },
  typingOn: function (recipientId, done) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    this.send(messageData, done);
  },
  typingOff: function (user, done) {
    var messageData = {
      recipient: {
        id: user.fbId
      },
      sender_action: "typing_off"
    };
    this.send(messageData, done);
  },
  welcome: function (user, done) {
    var messageData = {
      recipient: {
        id: user.fbId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Hello, and welcome",
            buttons: [{
              type: "postback",
              title: "Start",
              payload: "start"
            }]
          }
        }
      }
    };
    this.send(messageData, done);
  },
  text: function (user, text, done) {
    var messageData = {
      recipient: {
        id: user.fbId
      },
      message: {
        text: text
      }
    };
    this.send(messageData, done);
  }
}