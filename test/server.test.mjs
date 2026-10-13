import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server.mjs';

test('serves the learning site and required assets with correct HTTP behavior', async () => {
  const server = createApp();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await fetch(base);
    assert.equal(page.status, 200);
    assert.match(page.headers.get('content-type'), /text\/html/);
    const html = await page.text();
    assert.match(html, /lang="zh-CN"/);
    for (const section of ['concepts', 'architecture', 'roadmap']) assert.ok(html.includes(`id="${section}"`));
    for (const [path, type] of [['/style.css', 'text/css'], ['/app.js', 'text/javascript']]) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.ok(response.headers.get('content-type').startsWith(type));
      assert.ok((await response.text()).length > 100);
    }
    assert.equal((await fetch(base + '/missing')).status, 404);
    assert.equal((await fetch(base + '/package.json')).status, 404);
    assert.equal((await fetch(base + '/.git/config')).status, 404);
    assert.equal((await fetch(base, { method: 'POST' })).status, 405);
    const head = await fetch(base, { method: 'HEAD' });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
