const { createModalState } = require('../src/ui/modalState');

let first;
let second;
let modals;

beforeEach(() => {
  document.body.className = '';
  document.body.innerHTML = '<div id="first" class="modal-overlay"><section class="modal"><button>Inside</button></section></div><div id="second" class="modal-overlay"></div><div id="page-gmail"></div>';
  first = document.getElementById('first');
  second = document.getElementById('second');
  modals = createModalState(document);
});

test('opening applies open state and scroll lock', () => {
  modals.open(first);
  expect(first.classList.contains('open')).toBe(true);
  expect(document.body.classList.contains('modal-is-open')).toBe(true);
});

test('closing restores scroll state', () => {
  modals.open(first);
  modals.close(first);
  expect(first.classList.contains('open')).toBe(false);
  expect(document.body.classList.contains('modal-is-open')).toBe(false);
});

test('only one modal can be open', () => {
  modals.open(first);
  modals.open(second);
  expect(first.classList.contains('open')).toBe(false);
  expect(second.classList.contains('open')).toBe(true);
});

test('Escape closes the active modal', () => {
  const stop = modals.start();
  modals.open(first);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(first.classList.contains('open')).toBe(false);
  stop();
});

test('backdrop click closes a modal', () => {
  const stop = modals.start();
  modals.open(first);
  first.click();
  expect(first.classList.contains('open')).toBe(false);
  stop();
});

test('click inside keeps the modal open', () => {
  const stop = modals.start();
  modals.open(first);
  first.querySelector('button').click();
  expect(first.classList.contains('open')).toBe(true);
  stop();
});

test('Gmail closes through its supplied callback', () => {
  const closeGmail = jest.fn(() => document.getElementById('page-gmail').classList.remove('active'));
  modals = createModalState(document, { closeGmail });
  const stop = modals.start();
  document.getElementById('page-gmail').classList.add('active');
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  expect(closeGmail).toHaveBeenCalledTimes(1);
  expect(document.body.classList.contains('modal-is-open')).toBe(false);
  stop();
});
