/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    sender: {
      model: 'user'
    },
    entry: {
      type: "string",
      index: true,
      required: true
    },
    text: {
      type: "string"
    },
    attachments: {
      type: "string"
    },
    payload: {
      type: "string"
    },
    nlps: {
      type: "array"
    }
  },
  beforeValidate: function (message, next) {
    if (message.nlps) {
      var nlps = [];
      for (var entity in message.nlps.entities) {
        message.nlps.entities[entity][0].topic = entity
        nlps.push(message.nlps.entities[entity][0])
      }
      message.nlps = nlps.sort(function (n1, n2) {
        return n1.confidence < n2.confidence;
      })
      return next();
    }
    message.nlps = [];
    next();
  }
};

