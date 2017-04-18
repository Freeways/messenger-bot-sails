var https = require('https');

module.exports = {
  send: function (messageData) {
    messageData.access_token = sails.config.parameters.pageAccessToken;
    var data = JSON.stringify(messageData);
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/' + sails.config.parameters.fbApiVersion + '/me/messages',
      qs: {access_token: sails.config.parameters.pageAccessToken},
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
        console.log(body)
        var message = JSON.parse(body);
        if (message.message_id)
          return sails.log.info("Message " + message.message_id + " sent to " + message.recipient_id);
        sails.log.info("API Call for " + message.recipient_id);
      });
    });
    req.on('error', function (err) {
      return sails.log.error(err);
    });
    req.write(data);
    req.end();
  },
  typingOn: function (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_on"
    };
    this.send(messageData);
  },
  typingOff: function (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      sender_action: "typing_off"
    };
    this.send(messageData);
  },
  welcome: function (recipientId) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: "Hello, and welcome to vRiddles!",
            buttons: [{
                type: "postback",
                title: "Start Solving!",
                payload: "DEVELOPER_DEFINED_PAYLOAD"
              }]
          }
        }
      }
    };
    this.send(messageData);
  }
}