const assert = require('assert');
const { start, data } = require('./server');

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
    assert.deepStrictEqual(json, data);
    console.log('Test passed');
  } catch (err) {
    console.error('Test failed', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
})();
