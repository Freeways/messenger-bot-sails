/**
 * validateMessage
 *
 * @module      :: Policy
 * @description :: make sure that all needed fields exists
 *
 */

module.exports = function (req, res, next) {
  if (req.allParams().object !== 'page') {
    sails.log.warn("Messing Page!");
    return res.badRequest({err: "Messing Page!"});
  }
  next();
}