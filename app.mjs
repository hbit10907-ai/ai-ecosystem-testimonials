import { testimonials } from './data.mjs';

export function filterTestimonials(items, feature) {
  return feature === '全部' ? items : items.filter(item => item.feature === feature);
}

const grid = typeof document === 'undefined' ? null : document.querySelector('#testimonial-grid');
const filters = typeof document === 'undefined' ? null : document.querySelector('#feature-filters');
const resultCount = typeof document === 'undefined' ? null : document.querySelector('#result-count');

if (grid && filters && resultCount) {
  const features = ['全部', ...new Set(testimonials.map(item => item.feature))];
  let selectedFeature = '全部';

  function makeCard(item) {
    const card = document.createElement('article');
    card.className = 'testimonial-card';

    const portrait = document.createElement('img');
    portrait.className = 'portrait';
    portrait.src = item.portrait;
    portrait.alt = 'AI 生成的示意人物肖像，非見證者本人';
    portrait.width = 120;
    portrait.height = 120;
    portrait.loading = 'lazy';

    const body = document.createElement('div');
    body.className = 'card-body';

    const feature = document.createElement('p');
    feature.className = 'card-feature';
    feature.textContent = item.feature;

    const quote = document.createElement('blockquote');
    quote.textContent = item.quote;

    const identity = document.createElement('div');
    identity.className = 'card-identity';
    const store = document.createElement('span');
    store.textContent = item.store;
    const name = document.createElement('strong');
    name.textContent = item.name;
    identity.append(store, name);

    body.append(feature, quote, identity);
    card.append(portrait, body);
    return card;
  }

  function render() {
    const filtered = filterTestimonials(testimonials, selectedFeature);
    grid.replaceChildren(...filtered.map(makeCard));
    resultCount.textContent = `顯示 ${filtered.length} 則見證`;
    for (const button of filters.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.feature === selectedFeature));
    }
  }

  for (const feature of features) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-button';
    button.dataset.feature = feature;
    button.textContent = feature === '全部' ? `全部 ${testimonials.length}` : feature;
    button.addEventListener('click', () => {
      selectedFeature = feature;
      render();
    });
    filters.append(button);
  }

  render();
}
