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
    message: {
      type: "string"
    },
    attachments: {
      type: "string"
    },
    payload: {
      type: "string"
    }
  }
};

