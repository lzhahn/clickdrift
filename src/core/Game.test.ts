import { Game } from './Game';
import { GameState } from '../types/game.types';
import '@testing-library/jest-dom';

describe('Game', () => {
  let game: Game;
  let container: HTMLElement;
  let pointsCounter: HTMLElement;
  let upgradesContainer: HTMLElement;

  beforeEach(() => {
    // Set up DOM elements
    container = document.createElement('div');
    container.id = 'game-container';
    
    pointsCounter = document.createElement('span');
    pointsCounter.id = 'points-counter';
    
    upgradesContainer = document.createElement('div');
    upgradesContainer.id = 'upgrades';
    
    document.body.appendChild(container);
    document.body.appendChild(pointsCounter);
    document.body.appendChild(upgradesContainer);
    
    // Initialize game
    game = new Game();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  describe('Game Initialization', () => {
    it('should initialize with correct default state', () => {
      expect(pointsCounter.textContent).toBe('0');
      expect(container.querySelector('.moving-button')).toBeTruthy();
    });

    it('should initialize upgrades menu', () => {
      const upgradeItems = upgradesContainer.querySelectorAll('.upgrade-item');
      expect(upgradeItems.length).toBe(2); // Click Power and Button Speed
      
      const upgradeButtons = upgradesContainer.querySelectorAll('.upgrade-button');
      expect(upgradeButtons.length).toBe(2);
      
      // All upgrade buttons should be disabled initially (no points)
      upgradeButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('Button Clicks', () => {
    it('should earn points on button click', () => {
      const button = container.querySelector('.moving-button') as HTMLButtonElement;
      button.click();
      expect(pointsCounter.textContent).toBe('1');
    });

    it('should move button to new position on click', () => {
      const button = container.querySelector('.moving-button') as HTMLButtonElement;
      const initialLeft = button.style.left;
      const initialTop = button.style.top;
      
      button.click();
      
      expect(button.style.left).not.toBe(initialLeft);
      expect(button.style.top).not.toBe(initialTop);
    });

    it('should create points popup on click', () => {
      const button = container.querySelector('.moving-button') as HTMLButtonElement;
      button.click();
      
      const popup = container.querySelector('.points-popup');
      expect(popup).toBeTruthy();
      expect(popup?.textContent).toBe('+1');
    });
  });

  describe('Upgrades', () => {
    beforeEach(() => {
      // Click 10 times to get enough points for upgrades
      const button = container.querySelector('.moving-button') as HTMLButtonElement;
      for (let i = 0; i < 10; i++) {
        button.click();
      }
    });

    it('should enable upgrades when enough points are earned', () => {
      const clickPowerButton = upgradesContainer.querySelector('[data-upgrade-id="click-power"]') as HTMLButtonElement;
      expect(clickPowerButton).not.toBeDisabled();
    });

    it('should purchase click power upgrade correctly', () => {
      const clickPowerButton = upgradesContainer.querySelector('[data-upgrade-id="click-power"]') as HTMLButtonElement;
      clickPowerButton.click();
      
      // Check points were deducted
      expect(pointsCounter.textContent).toBe('0');
      
      // Click button and verify doubled points
      const gameButton = container.querySelector('.moving-button') as HTMLButtonElement;
      gameButton.click();
      expect(pointsCounter.textContent).toBe('2');
    });

    it('should purchase button speed upgrade correctly', () => {
      // Click 5 more times to afford button speed upgrade
      const gameButton = container.querySelector('.moving-button') as HTMLButtonElement;
      for (let i = 0; i < 5; i++) {
        gameButton.click();
      }
      
      const buttonSpeedUpgrade = upgradesContainer.querySelector('[data-upgrade-id="button-speed"]') as HTMLButtonElement;
      buttonSpeedUpgrade.click();
      
      // Verify the button has updated transition speed
      gameButton.click();
      const transitionTime = parseFloat(gameButton.style.transition.match(/[\d.]+s/)?.[0] || '0');
      expect(transitionTime).toBeCloseTo(0.2, 2); // 0.3/1.5, allowing for floating point imprecision
    });

    it('should update upgrade display after purchase', () => {
      const clickPowerButton = upgradesContainer.querySelector('[data-upgrade-id="click-power"]') as HTMLButtonElement;
      clickPowerButton.click();
      
      const upgradeEffect = upgradesContainer.querySelector('.effect') as HTMLElement;
      expect(upgradeEffect.textContent).toContain('2x');
    });

    it('should disable upgrades when points are insufficient', () => {
      const clickPowerButton = upgradesContainer.querySelector('[data-upgrade-id="click-power"]') as HTMLButtonElement;
      clickPowerButton.click(); // Spend all points
      
      const buttonSpeedUpgrade = upgradesContainer.querySelector('[data-upgrade-id="button-speed"]') as HTMLButtonElement;
      expect(buttonSpeedUpgrade).toBeDisabled();
    });
  });

  describe('Save and Load', () => {
    it('should save game state with upgrades', () => {
      // Buy an upgrade
      const button = container.querySelector('.moving-button') as HTMLButtonElement;
      for (let i = 0; i < 10; i++) {
        button.click();
      }
      
      const clickPowerButton = upgradesContainer.querySelector('[data-upgrade-id="click-power"]') as HTMLButtonElement;
      clickPowerButton.click();
      
      // Create new game instance
      document.body.innerHTML = '';
      document.body.appendChild(container);
      document.body.appendChild(pointsCounter);
      document.body.appendChild(upgradesContainer);
      
      const newGame = new Game();
      
      // Verify state was restored
      expect(pointsCounter.textContent).toBe('0'); // Points were spent
      
      // Click button to verify multiplier was restored
      const newButton = container.querySelector('.moving-button') as HTMLButtonElement;
      newButton.click();
      expect(pointsCounter.textContent).toBe('2'); // 2x multiplier
    });
  });
});
