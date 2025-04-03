import { GameState, Point, ButtonConfig, ButtonVariant, ButtonModifier, UpgradeType } from '../types/game.types';
import { UpgradeManager } from './UpgradeManager';

export class Game {
  private state: GameState;
  private buttons: Map<string, ButtonConfig>;
  private container: HTMLElement;
  private pointsCounter: HTMLElement;
  private upgradesContainer: HTMLElement;

  constructor() {
    this.state = {
      points: 0,
      clickMultiplier: 1,
      autoClickerRate: 0,
      buttonSpeed: 1,
      upgrades: UpgradeManager.initializeUpgrades()
    };
    this.buttons = new Map();
    
    // Initialize DOM elements
    this.container = document.getElementById('game-container') as HTMLElement;
    this.pointsCounter = document.getElementById('points-counter') as HTMLElement;
    this.upgradesContainer = document.getElementById('upgrades') as HTMLElement;
    
    if (!this.container || !this.pointsCounter || !this.upgradesContainer) {
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
    this.renderUpgrades();
  }

  private createInitialButton(): void {
    const buttonConfig: ButtonConfig = {
      position: this.getRandomPosition(),
      size: 60,
      speed: this.state.buttonSpeed,
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

    // Add points based on click multiplier
    const pointsEarned = Math.floor(this.state.clickMultiplier);
    this.addPoints(pointsEarned);
    
    // Move button to new position with current speed
    const newPosition = this.getRandomPosition();
    const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
    if (button) {
      button.style.left = `${newPosition.x}px`;
      button.style.top = `${newPosition.y}px`;
      config.position = newPosition;
      
      // Apply speed to transition
      const speedMultiplier = Math.max(0.1, Math.min(2, this.state.buttonSpeed));
      button.style.transition = `left ${0.3/speedMultiplier}s ease, top ${0.3/speedMultiplier}s ease`;
    }

    // Show points popup
    this.createPointsPopup(config.position, pointsEarned);

    // Save game after each click
    this.saveGame();
  }

  private renderUpgrades(): void {
    this.upgradesContainer.innerHTML = '<h2>Upgrades</h2>';
    
    Object.values(this.state.upgrades).forEach(upgrade => {
      const upgradeElement = document.createElement('div');
      upgradeElement.className = 'upgrade-item';
      
      const canPurchase = UpgradeManager.canPurchaseUpgrade(this.state, upgrade.id);
      upgradeElement.classList.toggle('can-purchase', canPurchase);
      
      upgradeElement.innerHTML = `
        <h3>${upgrade.name} (Level ${upgrade.level}/${upgrade.maxLevel})</h3>
        <p>${upgrade.description}</p>
        <p class="effect">${UpgradeManager.getUpgradeEffect(upgrade)}</p>
        <button class="upgrade-button" data-upgrade-id="${upgrade.id}" 
                ${!canPurchase ? 'disabled' : ''}>
          Buy (${upgrade.cost} CP)
        </button>
      `;
      
      const button = upgradeElement.querySelector('button');
      if (button) {
        button.addEventListener('click', () => this.purchaseUpgrade(upgrade.id));
      }
      
      this.upgradesContainer.appendChild(upgradeElement);
    });
  }

  private purchaseUpgrade(upgradeId: string): void {
    if (!UpgradeManager.canPurchaseUpgrade(this.state, upgradeId)) return;
    
    const oldState = { ...this.state };
    this.state = UpgradeManager.purchaseUpgrade(this.state, upgradeId);
    
    // Update button speed if it changed
    if (oldState.buttonSpeed !== this.state.buttonSpeed) {
      const button = this.buttons.get('initial');
      if (button) {
        button.speed = this.state.buttonSpeed;
      }
    }
    
    this.updateDisplay();
    this.renderUpgrades();
    this.saveGame();
  }

  private addPoints(amount: number): void {
    this.state.points += amount;
    this.updateDisplay();
    this.renderUpgrades(); // Re-render upgrades to update availability
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
    const upgradeWidth = 340; // 300px width + 20px padding on each side
    const maxX = window.innerWidth - padding * 2 - upgradeWidth;
    const maxY = window.innerHeight - padding * 2;
    
    return {
      x: Math.random() * maxX + padding,
      y: Math.random() * maxY + padding
    };
  }

  private updateDisplay(): void {
    this.pointsCounter.textContent = Math.floor(this.state.points).toString();
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
      const parsed = JSON.parse(savedState);
      this.state = { ...this.state, ...parsed };
      this.updateDisplay();
    }
  }
}
