import { GameState, Point, ButtonConfig, ButtonVariant, ButtonModifier } from '../types/game.types';

export class Game {
  private state: GameState;
  private buttons: Map<string, ButtonConfig>;
  private container: HTMLElement;
  private pointsCounter: HTMLElement;

  constructor() {
    this.state = {
      points: 0,
      clickMultiplier: 1,
      autoClickerRate: 0
    };
    this.buttons = new Map();
    
    // Initialize DOM elements
    this.container = document.getElementById('game-container') as HTMLElement;
    this.pointsCounter = document.getElementById('points-counter') as HTMLElement;
    
    if (!this.container || !this.pointsCounter) {
      throw new Error('Required DOM elements not found');
    }

    // Initialize display
    this.updateDisplay();
    this.init();
  }

  private init(): void {
    this.loadGame();
    this.createInitialButton();
    this.setupAutoSave();
  }

  private createInitialButton(): void {
    const buttonConfig: ButtonConfig = {
      position: this.getRandomPosition(),
      size: 60,
      speed: 1,
      variant: ButtonVariant.Normal,
      modifiers: [ButtonModifier.None]
    };

    this.createButton('initial', buttonConfig);
  }

  private createButton(id: string, config: ButtonConfig): void {
    const button = document.createElement('button');
    button.className = 'moving-button';
    button.textContent = 'Click!';
    button.dataset.id = id;
    button.style.left = `${config.position.x}px`;
    button.style.top = `${config.position.y}px`;
    
    button.addEventListener('click', () => this.handleButtonClick(id));
    
    this.container.appendChild(button);
    this.buttons.set(id, config);
  }

  private handleButtonClick(buttonId: string): void {
    const config = this.buttons.get(buttonId);
    if (!config) return;

    // Add points
    this.addPoints(this.state.clickMultiplier);
    
    // Move button to new position
    const newPosition = this.getRandomPosition();
    const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
    if (button) {
      button.style.left = `${newPosition.x}px`;
      button.style.top = `${newPosition.y}px`;
      config.position = newPosition;
    }

    // Show points popup
    this.createPointsPopup(config.position, this.state.clickMultiplier);

    // Save game after each click
    this.saveGame();
  }

  private addPoints(amount: number): void {
    this.state.points += amount;
    this.updateDisplay();
  }

  private createPointsPopup(position: Point, points: number): void {
    const popup = document.createElement('div');
    popup.className = 'points-popup';
    popup.textContent = `+${points}`;
    popup.style.left = `${position.x}px`;
    popup.style.top = `${position.y}px`;
    
    this.container.appendChild(popup);
    
    // Remove popup after animation
    setTimeout(() => popup.remove(), 1000);
  }

  private getRandomPosition(): Point {
    const padding = 100;
    return {
      x: Math.random() * (window.innerWidth - padding * 2) + padding,
      y: Math.random() * (window.innerHeight - padding * 2) + padding
    };
  }

  private updateDisplay(): void {
    this.pointsCounter.textContent = this.state.points.toString();
  }

  private setupAutoSave(): void {
    setInterval(() => this.saveGame(), 10000);
  }

  private saveGame(): void {
    localStorage.setItem('clickDriftSave', JSON.stringify(this.state));
  }

  private loadGame(): void {
    const savedState = localStorage.getItem('clickDriftSave');
    if (savedState) {
      this.state = { ...this.state, ...JSON.parse(savedState) };
      this.updateDisplay();
    }
  }
}
