import { GameState, Point, ButtonConfig, ButtonVariant, ButtonModifier, UpgradeType } from '../types/game.types';
import { UpgradeManager } from './UpgradeManager';

export class Game {
  private state: GameState;
  private buttons: Map<string, ButtonConfig>;
  private container: HTMLElement;
  private pointsCounter: HTMLElement;
  private upgradesContainer: HTMLElement;
  private autoClickerMouseEl: HTMLDivElement | null = null;
  private autoClickerActive = false;
  private autoClickerInterval: number | null = null;

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
    this.checkAutoClickerActivation();
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
    button.style.position = 'absolute';
    button.style.width = `${config.size}px`;
    button.style.height = `${config.size}px`;
    button.style.left = `${config.position.x}px`;
    button.style.top = `${config.position.y}px`;
    button.style.zIndex = '90';
    button.style.pointerEvents = 'auto';
    
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
    this.checkAutoClickerActivation();
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
    popup.style.position = 'absolute';
    popup.style.left = `${position.x}px`;
    popup.style.top = `${position.y}px`;
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.pointerEvents = 'none';
    popup.style.zIndex = '110';
    
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

  private createAutoClickerMouse(): void {
    if (this.autoClickerMouseEl) return;
    const mouse = document.createElement('div');
    mouse.className = 'auto-clicker-mouse';
    mouse.style.position = 'absolute';
    mouse.style.width = '32px';
    mouse.style.height = '48px';
    mouse.style.zIndex = '120';
    mouse.style.pointerEvents = 'none';
    mouse.style.background = 'none';
    mouse.innerHTML = '';
    const img = document.createElement('img');
    img.src = '/mouse.png';
    img.alt = 'Auto Clicker Mouse';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.display = 'block';
    mouse.appendChild(img);
    this.autoClickerMouseEl = mouse;
    this.container.appendChild(mouse);
  }

  private moveAutoClickerMouseToButton(buttonId: string): void {
    if (!this.autoClickerMouseEl) return;
    const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    // Center mouse pointer at center of button
    const mouseX = rect.left + rect.width / 2 - 16; // 16 = half mouse width
    const mouseY = rect.top + rect.height / 2 - 24; // 24 = half mouse height
    this.autoClickerMouseEl.style.left = `${mouseX}px`;
    this.autoClickerMouseEl.style.top = `${mouseY}px`;
    this.autoClickerMouseEl.style.transition = 'left 0.5s cubic-bezier(0.22, 1, 0.36, 1), top 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
  }

  private startAutoClicker(): void {
    if (this.autoClickerActive) return;
    this.autoClickerActive = true;
    this.createAutoClickerMouse();
    const buttonId = 'initial';
    let lastTarget = { x: 0, y: 0 };
    const getButtonCenter = () => {
      const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
      if (!button) return null;
      const rect = button.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    };
    const getMousePos = () => {
      if (!this.autoClickerMouseEl) return null;
      const rect = this.autoClickerMouseEl.getBoundingClientRect();
      return { x: rect.left + 16, y: rect.top + 24 };
    };
    this.moveAutoClickerMouseToButton(buttonId);
    this.autoClickerInterval = window.setInterval(() => {
      // Move mouse
      this.moveAutoClickerMouseToButton(buttonId);
      lastTarget = getButtonCenter() || lastTarget;
      // Wait for mouse to be close enough before clicking
      setTimeout(() => {
        if (!this.autoClickerActive) return;
        const mousePos = getMousePos();
        const dist = mousePos && lastTarget ? Math.hypot(mousePos.x - lastTarget.x, mousePos.y - lastTarget.y) : 9999;
        if (dist < 8) { // 8px threshold
          const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
          if (button) button.click();
        }
      }, 500); // Wait for transition duration
    }, 1000 / Math.max(1, this.state.autoClickerRate || 1));
  }

  private stopAutoClicker(): void {
    this.autoClickerActive = false;
    if (this.autoClickerInterval) {
      clearInterval(this.autoClickerInterval);
      this.autoClickerInterval = null;
    }
    if (this.autoClickerMouseEl) {
      this.autoClickerMouseEl.remove();
      this.autoClickerMouseEl = null;
    }
  }

  private checkAutoClickerActivation(): void {
    if (this.state.autoClickerRate > 0) {
      this.startAutoClicker();
    } else {
      this.stopAutoClicker();
    }
  }
}
