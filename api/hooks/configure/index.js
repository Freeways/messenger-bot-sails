module.exports = function (sails) {

  return {
    initialize: function (cb) {
      sails.config.messenger.appSecret = (process.env.MESSENGER_APP_SECRET) ?
          (process.env.MESSENGER_APP_SECRET) : sails.config.messenger.appSecret;
      sails.config.messenger.validationToken = (process.env.MESSENGER_VALIDATION_TOKEN) ?
          (process.env.MESSENGER_VALIDATION_TOKEN) : sails.config.messenger.validationToken;
      sails.config.messenger.pageAccessToken = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
          (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : sails.config.messenger.pageAccessToken;
      sails.config.parameters.serverURL = (process.env.SERVER_URL) ?
          (process.env.SERVER_URL) : sails.config.parameters.serverURL;
console.log(sails.config.messenger.appSecret)
      if (!(sails.config.messenger.appSecret && sails.config.messenger.validationToken && sails.config.messenger.pageAccessToken && sails.config.parameters.serverURL)) {
        sails.log.error("Messenger Bot : Missing config values! Please set your facebook app credentials before running `sails lift`");
        return process.exit(1);
      }

      return cb();
    }
  }

};
