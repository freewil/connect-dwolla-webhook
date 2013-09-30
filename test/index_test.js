var dwolla = require('../');
var util = require('../util');
var connect = require('connect');
var http = require('http');
var post = require('request').post;
var assert = require('assert');

var VALID_SECRET = 'myawesomesecretkey';
var INVALID_SECRET = VALID_SECRET + 'nowinvalid';

describe('connect-dwolla-webhook', function() {
  var server;
  
  before(function() {
    // start server
    var app = connect()
      .use(connect.bodyParser())
      .use(dwolla({ secret: VALID_SECRET }))
      .use(function(err, req, res, next) {
        // dwolla will send forbidden error here
        if (err.status) res.statusCode = err.status;
        res.end();
      })
      .use(function(req, res) {
        res.end('Hello from Connect!\n');
      });
    server = http.createServer(app).listen(3000);
  });
  
  after(function() {
    // stop the server
    server.close();
  });
  
  it('should accept valid signature requests', function(done) {
    var data = {
      'Id': '3794758',
      'Type': 'Transaction',
      'Subtype': 'Status',
      'Created': '9/29/2013 2:52:49 AM',
      'Triggered': '9/29/2013 2:52:48 AM',
      'Value': 'processed'
    };
    var signature = util.getSig(VALID_SECRET, data);
    post({
      uri: 'http://localhost:3000/',
      json: data,
      headers: {
        'X-Dwolla-Signature': signature
      }
    }, function(err, res, body) {
      assert.ifError(err);
      assert.equal(200, res.statusCode);
      assert.equal('Hello from Connect!\n', body);
      done();
    });
  });
  
  it('should not accept invalid signature requests', function(done) {
    var data = {
      'Id': '3794758',
      'Type': 'Transaction',
      'Subtype': 'Status',
      'Created': '9/29/2013 2:52:49 AM',
      'Triggered': '9/29/2013 2:52:48 AM',
      'Value': 'processed'
    };
    var signature = util.getSig(INVALID_SECRET, data);
    post({
      uri: 'http://localhost:3000/',
      json: data,
      headers: {
        'X-Dwolla-Signature': signature
      }
    }, function(err, res, body) {
      assert.ifError(err);
      assert.equal(403, res.statusCode);
      assert.equal(undefined, body);
      done();
    });
  });
  
});
