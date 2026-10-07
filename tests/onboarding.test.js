const { readOnboarded, writeOnboarded, startOnboarding } = require('../src/onboarding');
const key = 'test_onboarded';

beforeEach(() => {
  localStorage.clear();
  document.body.innerHTML =
    '<div id="onboardOverlay" style="display:none"><button id="onboardKeep">Keep</button><button id="onboardClear">Clear</button></div>';
});

test('empty storage shows first-run onboarding', () => {
  startOnboarding({ doc: document, storage: localStorage, key, onClear: jest.fn() });
  expect(document.getElementById('onboardOverlay').style.display).toBe('flex');
});

test('completion saves state and hides onboarding next time', () => {
  startOnboarding({ doc: document, storage: localStorage, key, onClear: jest.fn() });
  document.getElementById('onboardKeep').click();
  expect(localStorage.getItem(key)).toBe('1');
  expect(document.getElementById('onboardOverlay').style.display).toBe('none');
  startOnboarding({ doc: document, storage: localStorage, key, onClear: jest.fn() });
  expect(document.getElementById('onboardOverlay').style.display).toBe('none');
});

test('corrupted stored value is treated as first run', () => {
  localStorage.setItem(key, '{broken json');
  expect(readOnboarded(localStorage, key)).toBe(false);
  startOnboarding({ doc: document, storage: localStorage, key, onClear: jest.fn() });
  expect(document.getElementById('onboardOverlay').style.display).toBe('flex');
});

test('storage read failure warns and does not crash', () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const storage = {
    getItem: () => {
      throw new Error('blocked');
    },
  };
  expect(readOnboarded(storage, key)).toBe(false);
  startOnboarding({ doc: document, storage, key, onClear: jest.fn() });
  expect(document.getElementById('onboardOverlay').style.display).toBe('flex');
  expect(warning).toHaveBeenCalled();
  warning.mockRestore();
});

test('storage write failure warns and does not crash', () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  expect(
    writeOnboarded(
      {
        setItem: () => {
          throw new Error('blocked');
        },
      },
      key,
    ),
  ).toBe(false);
  expect(warning).toHaveBeenCalled();
  warning.mockRestore();
});

test('confirmed clear calls the supplied clear action', () => {
  const confirmation = jest.spyOn(window, 'confirm').mockReturnValue(true);
  const onClear = jest.fn();
  startOnboarding({ doc: document, storage: localStorage, key, onClear });
  document.getElementById('onboardClear').click();
  expect(onClear).toHaveBeenCalledTimes(1);
  expect(localStorage.getItem(key)).toBe('1');
  confirmation.mockRestore();
});

test('cancelled clear preserves onboarding', () => {
  const confirmation = jest.spyOn(window, 'confirm').mockReturnValue(false);
  const onClear = jest.fn();
  startOnboarding({ doc: document, storage: localStorage, key, onClear });
  document.getElementById('onboardClear').click();
  expect(onClear).not.toHaveBeenCalled();
  expect(localStorage.getItem(key)).toBeNull();
  confirmation.mockRestore();
});
