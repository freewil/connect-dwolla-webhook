var scmp = require('scmp');
var util = require('./util');

module.exports = function dwollaWebhook(options) {
  var secret = options.secret || '';
  
  return function(req, res, next) {
    // require connect.json() / connect.bodyParser() middleware
    if (!req.body) return next(util.forbidden());
    
    var actual = req.headers['x-dwolla-signature'] || '';
    var expected = util.getSig(secret, req.body);
    
    if (!scmp(actual, expected)) return next(util.forbidden());
    
    next();
  };
};
