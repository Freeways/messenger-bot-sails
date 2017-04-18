/**
 * verifySignature
 *
 * @module      :: Policy
 * @description :: verify the Request's Signature
 *
 */

var crypto = require('crypto');

module.exports = function (req, res, next) {
  var signature = req.signature;

  if (!signature) {
    sails.log.warn("Oops, parser didn't check for signature !!!");
    return res.serverError({err: "Internal server error: Parser went off!"});
  } else {
    if(!signature.signed){
      sails.log.warn("Unsigned request!");
      //return res.badRequest({err: "Unsigned request!"});
    }
    if(!signature.verified){
      sails.log.warn("Couldn't validate the request signature.");
      //return res.badRequest({err: "Couldn't validate the signature."});
    }
    next();
  }
}