var crypto = require('crypto');
var scmp = require('scmp');

module.exports = function dwollaWebhook(options) {
  var secret = options.secret || '';
  
  return function(req, res, next) {
    var sig = req.headers['x-dwolla-signature'] || '';
    var hash = crypto
      .createHmac('sha1', secret)
      .update(req.body)
      .digest('hex');
      
    if (!scmp(sig, hash)) return res.send(403);
    
    next();
  };
};
