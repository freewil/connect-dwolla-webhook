# connect-dwolla-webhook

When adding support for [Dwolla's Webhooks](https://developers.dwolla.com/dev/pages/webhooks),
it's a good idea (read: MUST) to check the validity of the request to ensure 
that it's actually from Dwolla. This simple middleware for `connect` does just
that.

## Example

```js
var connect = require('connect'),
    connectDwolla = require('connect-dwolla-webhook');

var app = connect()
  .use(connect.bodyParser())
  .use(connectDwolla({ secret: 'my-dwolla-app-secret' }))
  .use(function(req, res){
    res.end('Hello Dwolla!\n');
  });
```
