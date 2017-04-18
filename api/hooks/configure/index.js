module.exports = function (sails) {

  return {
    initialize: function (cb) {
      sails.config.parameters.appSecret = (process.env.MESSENGER_APP_SECRET) ?
          (process.env.MESSENGER_APP_SECRET) : sails.config.parameters.appSecret;
      sails.config.parameters.validationToken = (process.env.MESSENGER_VALIDATION_TOKEN) ?
          (process.env.MESSENGER_VALIDATION_TOKEN) : sails.config.parameters.validationToken;
      sails.config.parameters.pageAccessToken = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
          (process.env.MESSENGER_PAGE_ACCESS_TOKEN) : sails.config.parameters.pageAccessToken;
      sails.config.parameters.serverURL = (process.env.SERVER_URL) ?
          (process.env.SERVER_URL) : sails.config.parameters.serverURL;

      if (!(sails.config.parameters.appSecret && sails.config.parameters.validationToken && sails.config.parameters.pageAccessToken && sails.config.parameters.serverURL)) {
        sails.log.error("Missing config values");
        return process.exit(1);
      }

      return cb();
    }
  }

};