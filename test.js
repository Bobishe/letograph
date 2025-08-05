const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { start } = require('./server');

(async () => {
  const server = await start(0); // random available port
  const port = server.address().port;
  try {
    const htmlRes = await fetch(`http://localhost:${port}/`);
    assert.strictEqual(htmlRes.status, 200);
    assert.match(htmlRes.headers.get('content-type') || '', /text\/html/);
    const html = await htmlRes.text();
    assert.ok(html.includes('<!DOCTYPE html>'));

    const res = await fetch(`http://localhost:${port}/data`);
    assert.strictEqual(res.status, 200);
    const json = await res.json();
    const expected = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data.json'), 'utf-8')
    );
    assert.deepStrictEqual(json, expected);
    console.log('Test passed');
  } catch (err) {
    console.error('Test failed', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
