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
  assert.match(home, /href="\.\/features\.html"/);
  assert.match(home, /人物照片為 AI 示意，非受訪者本人/);
  assert.match(testimonialsPage, /id="testimonial-grid"/);
  assert.match(testimonialsPage, /src="\.\/app\.mjs"/);
  assert.match(testimonialsPage, /href="\.\/"/);
  assert.match(testimonialsPage, /href="\.\/features\.html"/);
});

test('home download section uses local QR images and the requested links', () => {
  const home = readFileSync(resolve(root, 'index.html'), 'utf8');
  assert.match(home, /href="#download">前往官方下載頁/);
  assert.match(home, /<section id="download"[^>]*aria-labelledby="support-title"/);
  assert.match(home, /href="\.\/pricing\.html">查看收費模式<\/a>/);
  assert.doesNotMatch(home, /原始官方網站/);
  for (const image of ['assets/download/ios-qr.png', 'assets/download/android-qr.png']) {
    assert.ok(existsSync(resolve(root, image)), `Missing ${image}`);
    assert.ok(home.includes(`./${image}`));
  }
});

test('pricing page shows the requested functions and only the selected tier', () => {
  const pricing = readFileSync(resolve(root, 'pricing.html'), 'utf8');
  assert.ok(existsSync(resolve(root, 'pricing.css')));
  for (const item of ['市售建物物件查找', '市售建物物件可能地址比對', '查看謄本資料', '每日訂閱條件：新物件上架推播通知', '貼網址比對物件', 'e小神通 LINE 簡易查詢功能', '地圖定位查找附近市售物件', '市售土地物件查找', '市售土地物件可能地號比對', '土地新物件上架推播通知', '土地圖台運用', '地圖定位查找附近土地資訊', '查詢全台建物、土地謄本雲資料(共2,500多筆)', '查詢全台新調閱、土地共享雲謄本資料(新調已74萬筆，持續增加中)']) {
    assert.ok(pricing.includes(item), `Missing paid function: ${item}`);
  }
  for (const price of ['11～15 人', '125,820', '36,000', '41,940', '5,000']) {
    assert.ok(pricing.includes(price), `Missing price: ${price}`);
  }
  assert.doesNotMatch(pricing, /<iframe\b|<video\b/);
  assert.doesNotMatch(pricing, /7～10 人|16～20 人/);
  for (const copy of ['根據人員級距進行收費、收費後功能皆能使用，', '同業採取各模組分開計費，售價推疊。', '下列為付費使用功能介紹說明', '其他人數間距及早鳥補助優惠，請洽各區顧問師。']) {
    assert.ok(pricing.includes(copy), `Missing pricing copy: ${copy}`);
  }
});

test('feature introduction preserves the source topics and two videos', () => {
  const featuresPage = readFileSync(resolve(root, 'features.html'), 'utf8');
  assert.ok(existsSync(resolve(root, 'features.css')));
  for (const label of ['百萬潛買', '通知功能', '開發功能', '相鄰土地', '每日新物件']) {
    assert.ok(featuresPage.includes(label), `Missing feature topic ${label}`);
  }
  assert.match(featuresPage, /youtube-nocookie\.com\/embed\/2i63W2J-ybE/);
  assert.match(featuresPage, /youtube-nocookie\.com\/embed\/aMQRHQNJm1A/);
  assert.match(featuresPage, /href="\.\/testimonials\.html"/);
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
