const http = require('http');
const fs = require('fs');
const path = require('path');

const data = {
  "2": [
    { n: 1, r: -68 },
    { n: 255, r: 0 },
    { n: 1, r: 0 },
    { n: 0, r: 0 }
  ]
};

function requestListener(req, res) {
  if (req.url === '/data') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } else if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}

function start(port = process.env.PORT || 3000) {
  const server = http.createServer(requestListener);
  return new Promise(resolve => {
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${server.address().port}`);
      resolve(server);
    });
  });
}

if (require.main === module) {
  start();
}

module.exports = { start, data };
