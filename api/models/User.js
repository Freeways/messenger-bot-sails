/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var languages = require('../utils/languages');

module.exports = {
  attributes: {
    fbId: {
      type: "string",
      required: true,
      unique: true,
      index: true
    },
    first_name: {
      type: "string",
      required: true
    },
    last_name: {
      type: "string",
      required: true
    },
    profile_pic: {
      type: "string",
      required: true
    },
    locale: {
      type: "string",
      enum: languages
    },
    timezone: {
      type: "integer"
    },
    gender: {
      type: "string"
    },
    score: {
      type: 'integer',
      defaultTo: 0
    },
    messages: {
      collection: 'message',
      via: 'sender'
    },
    played: {
      type: 'array',
      defaultTo: []
    },
    current: {
      model: 'riddle'
    },
    tries: {
      type: 'integer',
      defaultTo: 0
    }
  },
  createFromFb: function (id, cb) {
    https = require('https');
    var options = {
      hostname: 'graph.facebook.com',
      port: 443,
      path: '/' + sails.config.parameters.fbApiVersion + '/' + id + '?access_token=' + sails.config.parameters.pageAccessToken,
      method: 'GET'
    };

    var req = https.request(options, function (res) {
      var body = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var fbUser = JSON.parse(body);
        fbUser.fbId = id;
        User.create(fbUser)
            .exec(function (err, user) {
              if (err)
                return cb(err, null);
              cb(null, user);
            });
      });
    });
    req.on('error', function (err) {
      return cb(err, null);
    });
    req.end();
  }
};

