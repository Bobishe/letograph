const http = require("http");
const fs = require("fs");
const path = require("path");

const data = {
  1: [
    { n: 2, r: -70 }, // к узлу 2 напрямую
    { n: 255, r: 0 }, // к себе
    { n: 3, r: -80 }, // напрямую к 3
    { n: 0, r: 0 }, // нет связи с 4
    { n: 2, r: 0 }, // через 2 к 5
    { n: 0, r: 0 }, // нет связи с 6
  ],
  2: [
    { n: 1, r: -78 }, // к 1 напрямую
    { n: 255, r: 0 }, // к себе
    { n: 1, r: 0 }, // к 3 через 1
    { n: 0, r: 0 }, // 4 недоступен
    { n: 5, r: -82 }, // напрямую к 5
    { n: 5, r: 0 }, // к 6 через 5
  ],
  3: [
    { n: 1, r: -80 }, // к 1 напрямую
    { n: 2, r: 0 }, // к 2 через 2 (тут нет прямой связи)
    { n: 255, r: 0 }, // к себе
    { n: 4, r: -65 }, // к 4 напрямую
    { n: 0, r: 0 }, // нет маршрута к 5
    { n: 0, r: 0 }, // нет маршрута к 6
  ],
  4: [
    { n: 3, r: -65 },
    { n: 0, r: 0 },
    { n: 3, r: -67 },
    { n: 255, r: 0 },
    { n: 5, r: -75 },
    { n: 0, r: 0 },
  ],
  5: [
    { n: 2, r: -82 },
    { n: 2, r: 0 },
    { n: 0, r: 0 },
    { n: 4, r: -75 },
    { n: 255, r: 0 },
    { n: 6, r: -79 },
  ],
  6: [
    { n: 0, r: 0 },
    { n: 5, r: 0 },
    { n: 0, r: 0 },
    { n: 0, r: 0 },
    { n: 5, r: -79 },
    { n: 255, r: 0 },
  ],
};

function requestListener(req, res) {
  if (req.url === "/data") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  } else if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(path.join(__dirname, "index.html"), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
}

function start(port = process.env.PORT || 3000) {
  const server = http.createServer(requestListener);
  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(
        `Server running on http://localhost:${server.address().port}`
      );
      resolve(server);
    });
  });
}

if (require.main === module) {
  start();
}

module.exports = { start, data };
