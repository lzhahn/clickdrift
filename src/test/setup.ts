// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback: FrameRequestCallback): number => {
  return setTimeout(callback, 0);
};

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id: number): void => {
  clearTimeout(id);
};

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = '';
});
