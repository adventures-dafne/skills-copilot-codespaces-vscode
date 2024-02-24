// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var comments = require('./comments.json');
var path = require('path');
var mime = require('mime');

// Create server
http.createServer(function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var pathname = url_parts.pathname;
  console.log('Request for ' + pathname + ' received.');

  if (req.method === 'GET') {
    if (pathname === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      res.end(fs.readFileSync('index.html'));
    } else if (pathname === '/comments') {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify(comments));
    } else {
      fs.readFile(pathname.substr(1), function(err, data) {
        if (err) {
          res.writeHead(404, {
            'Content-Type': 'text/html'
          });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': mime.lookup(pathname)
          });
          res.end(data);
        }
      });
    }
  } else if (req.method === 'POST') {
    var body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      var post = qs.parse(body);
      comments.push(post);
      fs.writeFile('comments.json', JSON.stringify(comments, null, 2), function(err) {
        if (err) {
          console.log(err);
        }
      });
    });
  }
}).listen(8080);
console.log('Server running at http://localhost:8080/');
