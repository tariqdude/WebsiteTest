const { calculatePrice, getToggledTheme } = require('../assets/js/main');

describe('calculatePrice', () => {
  test('returns monthly price when yearly is false', () => {
    expect(calculatePrice(5, false)).toBe('$5');
  });

  test('returns yearly price when yearly is true', () => {
    expect(calculatePrice(5, true)).toBe('$50');
  });
});

describe('getToggledTheme', () => {
  test('toggles dark to light', () => {
    expect(getToggledTheme('dark')).toBe('light');
  });

  test('toggles light to dark', () => {
    expect(getToggledTheme('light')).toBe('dark');
  });
});
