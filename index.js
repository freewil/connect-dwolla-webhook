var scmp = require('scmp');
var util = require('./util');

module.exports = function dwollaWebhook(options) {
  var secret = options.secret || '';
  
  return function(req, res, next) {
    var actual = req.headers['x-dwolla-signature'] || '';
    var expected = util.getSig(secret, req.body);
    if (!scmp(actual, expected)) {
      var err = new Error('Forbidden');
      err.status = 403;
      return next(err);
    }
    
    next();
  };
};
