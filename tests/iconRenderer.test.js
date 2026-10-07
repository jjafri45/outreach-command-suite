const { iconSvg, renderIcons, paths } = require('../src/ui/iconRenderer');

test.each(Object.keys(paths))('%s renders a valid, accessible SVG', (name) => {
  const host = document.createElement('div');
  host.innerHTML = iconSvg(name);
  const svg = host.querySelector('svg');
  expect(svg).not.toBeNull();
  expect(svg.getAttribute('aria-hidden')).toBe('true');
  expect(svg.querySelector('path').getAttribute('d')).toBe(paths[name]);
});

test('unknown icon falls back without injecting markup', () => {
  const result = iconSvg('bad"><script>alert(1)</script>');
  expect(result).toContain(paths.dashboard);
  expect(result).not.toContain('<script>');
});

test('renders known navigation slots and leaves unrelated slots alone', () => {
  document.body.innerHTML = '<nav class="nav"><a data-page="ledger"><span class="nav-icon"></span></a><a data-page="unknown"><span class="nav-icon">keep</span></a></nav>';
  renderIcons(document);
  expect(document.querySelector('[data-page="ledger"] svg')).not.toBeNull();
  expect(document.querySelector('[data-page="unknown"] .nav-icon').textContent).toBe('keep');
});
