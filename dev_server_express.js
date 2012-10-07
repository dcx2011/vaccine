var sourceDir = 'src';   // Change this to... uh, your source directory.


var express = require('express'),
    fs = require('fs'),
    exec = require('child_process').exec,
    app = express();

app.get(/^\/build[\/\w]*\.?\w*$/, function(req, res) {
  exec('.' + req.path, {maxBuffer: 1024*1024}, function(err, stdout) {
    if (err) return notFound(err, req.path, res);
    res.type('application/javascript');
    res.send(stdout);
  });
});

app.get(new RegExp('^/' + sourceDir + '/'), function(req, res) {
  findFile(req.path, function(err, fileBufferOrText, path) {
    if (err) return notFound(err, req.path, res);
    res.type('application/javascript');
    res.send(fileBufferOrText);
  });
});

function notFound(err, path, res) {
  if (err !== true) console.log(err);
  if (!path.match(/favicon\.ico/)) console.log('404: ' + path);
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('404 Not Found\n');
}

function findFile(path, callback, lastCheck) {
  fs.stat('.' + path, function(err, stats) {
    if (err) {
      if (lastCheck) return callback(true);
      var re = /\/(\w*)\.js$/,
          match = re.exec(path);
      if (!match) return callback(true);
      var dir = match[1],
          replace = '/' + (dir ? dir + '/' : '') + 'index.js';
      findFile(path.replace(re, replace), callback, true);
      return;
    }

    fs.readFile('.' + path, function(err, buffer) {
      callback(err, buffer, path);
    });
  });
}



app.use(express.static(__dirname));

app.listen(3000);
console.log('Serving localhost:3000');
