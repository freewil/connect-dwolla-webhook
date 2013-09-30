var crypto = require('crypto');

module.exports.getSig = function(secret, data) {
  return crypto
    .createHmac('sha1', secret)
    .update(JSON.stringify(data))
    .digest('hex');
};

module.exports.forbidden = function() {
  var err = new Error('Forbidden');
  err.status = 403;
  return err;
};
