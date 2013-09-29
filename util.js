var crypto = require('crypto');
var stringify = require('querystring').stringify;

module.exports.getSig = function(secret, data) {
  return crypto
    .createHmac('sha1', secret)
    .update(stringify(data))
    .digest('hex');
};
