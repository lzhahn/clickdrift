import { Game } from './Game';
import { setupGameDOM, getButtonElement, getPointsPopup, simulateClick, wait } from '../test/utils';
import { ButtonVariant, ButtonModifier } from '../types/game.types';

describe('Game', () => {
  beforeEach(() => {
    setupGameDOM();
  });

  describe('Initialization', () => {
    it('should create initial button', () => {
      const game = new Game();
      const button = getButtonElement();
      
      expect(button).toBeTruthy();
      expect(button.className).toBe('moving-button');
      expect(button.textContent).toBe('Click!');
    });

    it('should initialize with zero points', () => {
      const game = new Game();
      const counter = document.getElementById('points-counter');
      
      expect(counter?.textContent).toBe('0');
    });

    it('should throw error if required DOM elements are missing', () => {
      document.body.innerHTML = '';
      
      expect(() => new Game()).toThrow('Required DOM elements not found');
    });
  });

  describe('Game Mechanics', () => {
    let game: Game;
    let button: HTMLButtonElement;
    let initialPosition: { left: string; top: string };

    beforeEach(() => {
      game = new Game();
      button = getButtonElement();
      initialPosition = {
        left: button.style.left,
        top: button.style.top
      };
    });

    it('should move button to new position on click', () => {
      simulateClick(button);
      
      expect(button.style.left).not.toBe(initialPosition.left);
      expect(button.style.top).not.toBe(initialPosition.top);
    });

    it('should increment points on button click', () => {
      const counter = document.getElementById('points-counter')!;
      simulateClick(button);
      
      expect(counter.textContent).toBe('1');
    });

    it('should create points popup on click', () => {
      simulateClick(button);
      const popup = getPointsPopup();
      
      expect(popup).toBeTruthy();
      expect(popup.textContent).toBe('+1');
    });

    it('should remove points popup after animation', async () => {
      simulateClick(button);
      await wait(1100);
      const popup = getPointsPopup();
      
      expect(popup).toBeFalsy();
    });
  });

  describe('Save/Load System', () => {
    let game: Game;
    
    beforeEach(() => {
      game = new Game();
    });

    it('should save game state to localStorage', () => {
      const button = getButtonElement();
      simulateClick(button);
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'clickDriftSave',
        expect.any(String)
      );
      
      const savedState = JSON.parse(
        (localStorage.setItem as jest.Mock).mock.calls[0][1]
      );
      expect(savedState.points).toBe(1);
    });

    it('should load saved game state', () => {
      const savedState = {
        points: 42,
        clickMultiplier: 2,
        autoClickerRate: 1
      };
      
      (localStorage.getItem as jest.Mock).mockReturnValue(
        JSON.stringify(savedState)
      );
      
      game = new Game();
      const counter = document.getElementById('points-counter');
      
      expect(counter?.textContent).toBe('42');
    });
  });

  describe('Button Configuration', () => {
    it('should create button with correct initial config', () => {
      const game = new Game();
      const button = getButtonElement();
      
      expect(button.dataset.id).toBe('initial');
      expect(button.style.left).toMatch(/\d+px/);
      expect(button.style.top).toMatch(/\d+px/);
    });
  });
});
