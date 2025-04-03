export const setupGameDOM = () => {
  // Create game container
  const container = document.createElement('div');
  container.id = 'game-container';
  document.body.appendChild(container);

  // Create points counter
  const hud = document.createElement('div');
  hud.id = 'hud';
  const counter = document.createElement('span');
  counter.id = 'points-counter';
  hud.appendChild(counter);
  container.appendChild(hud);

  return { container, counter };
};

export const getButtonElement = () => {
  return document.querySelector('.moving-button') as HTMLButtonElement;
};

export const getPointsPopup = () => {
  return document.querySelector('.points-popup') as HTMLDivElement;
};

export const simulateClick = (element: HTMLElement) => {
  const clickEvent = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  element.dispatchEvent(clickEvent);
};

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
