var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.sendFile('dist/index.html', { root : __dirname });
});

app.use('/', express.static('dist'));

app.use('/crimes', function(req, res) {
  res.sendFile('data/seattle-crimes.json', { root : __dirname })
});

var envPort = process.env.PORT || 3002;

var server = app.listen(envPort, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
