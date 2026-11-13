import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('home page introduces original features and links to preserved testimonials', () => {
  const home = readFileSync(resolve(root, 'index.html'), 'utf8');
  const testimonialsPage = readFileSync(resolve(root, 'testimonials.html'), 'utf8');
  for (const label of ['土地開發', '建物開發', '百萬潛買', '官網留單', '新進五大案', '最新降價通知', '專任委託通知']) {
    assert.ok(home.includes(label), `Missing home feature ${label}`);
  }
  assert.match(home, /href="\.\/testimonials\.html"/);
  assert.match(home, /人物照片為 AI 示意，非受訪者本人/);
  assert.match(testimonialsPage, /id="testimonial-grid"/);
  assert.match(testimonialsPage, /src="\.\/app\.mjs"/);
  assert.match(testimonialsPage, /href="\.\/"/);
});

test('the source testimonials are complete and have local distinct portraits', async () => {
  assert.ok(existsSync(resolve(root, 'data.mjs')));
  const { testimonials } = await import('../data.mjs');
  assert.equal(testimonials.length, 33);
  assert.equal(testimonials[0].store, '永華加盟店');
  assert.equal(testimonials[0].quote, '有手機就可以用，隨時可以查詢，增加開發量還可減少工作時間。');
  assert.equal(testimonials.at(-1).store, '楠梓高大謙行店');
  assert.equal(new Set(testimonials.map(item => item.portrait)).size, 33);
  for (const item of testimonials) {
    assert.ok(item.store && item.name && item.feature && item.quote);
    assert.match(item.name, /^(?:[\u4e00-\u9fff]OO|店長)$/);
    assert.ok(existsSync(resolve(root, item.portrait)), `Missing ${item.portrait}`);
  }
});

test('feature filtering retains source order and selects only matching cards', async () => {
  assert.ok(existsSync(resolve(root, 'app.mjs')));
  const { filterTestimonials } = await import('../app.mjs');
  const input = [
    { id: 1, feature: 'e小神通' },
    { id: 2, feature: '百萬潛買' },
    { id: 3, feature: 'e小神通' },
  ];
  assert.deepEqual(filterTestimonials(input, '全部'), input);
  assert.deepEqual(filterTestimonials(input, 'e小神通').map(item => item.id), [1, 3]);
  assert.deepEqual(filterTestimonials(input, '不存在'), []);
});
