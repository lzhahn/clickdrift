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
  private bouncingButtons: Map<string, {vx: number; vy: number}> = new Map();

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
    this.setupDeleteSaveButton();
  }

  private createInitialButton(): void {
    const buttonConfig: ButtonConfig = {
      position: this.getRandomPosition(),
      size: 60,
      speed: this.state.buttonSpeed,
      variant: ButtonVariant.Normal,
      modifiers: [] 
    };

    this.createButton('initial', buttonConfig);
  }

  private createButton(id: string, config: ButtonConfig): void {
    this.maybeAddModifier(config);
    const button = document.createElement('button');
    button.className = 'moving-button';
    button.textContent = this.getButtonLabel(config.variant, config.modifiers);
    button.dataset.id = id;
    button.style.position = 'absolute';
    button.style.width = `${config.size}px`;
    button.style.height = `${config.size}px`;
    button.style.left = `${config.position.x}px`;
    button.style.top = `${config.position.y}px`;
    button.style.zIndex = '90';
    button.style.pointerEvents = 'auto';
    if (config.variant && config.variant !== ButtonVariant.Normal) {
      button.classList.add(`variant-${config.variant}`);
    }
    for (const modifier of config.modifiers) {
      if (modifier !== ButtonModifier.None) {
        button.classList.add(`modifier-${modifier}`);
      }
    }
    button.addEventListener('click', () => this.handleButtonClick(id));
    this.container.appendChild(button);
    this.buttons.set(id, config);
    // Apply modifier effects
    this.applyModifierEffects(button, config, id);
  }

  private handleButtonClick(buttonId: string): void {
    const config = this.buttons.get(buttonId);
    if (!config) return;

    // --- Variant Effects ---
    let pointsEarned = Math.floor(this.state.clickMultiplier);
    let isRareVariant = false;
    if (config.variant === ButtonVariant.Golden) {
      pointsEarned *= 5;
      isRareVariant = true;
      this.createExplosionEffect(buttonId, 'golden');
    }  else if (config.variant === ButtonVariant.Frozen) {
      pointsEarned += 10;
      isRareVariant = true;
      this.createExplosionEffect(buttonId, 'frozen');
    }
    this.addPoints(pointsEarned);
    // --- End Variant Effects ---

    // Move button to new position with current speed
    const newPosition = this.getRandomPosition();
    const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
    if (button) {
      button.style.left = `${newPosition.x}px`;
      button.style.top = `${newPosition.y}px`;
      config.position = newPosition;
      const speedMultiplier = Math.max(0.1, Math.min(2, this.state.buttonSpeed));
      button.style.transition = `left ${0.3/speedMultiplier}s ease, top ${0.3/speedMultiplier}s ease`;
    }
    this.createPointsPopup(config.position, pointsEarned);
    this.saveGame();
    // --- Variant spawn logic ---
    this.maybeSpawnVariant();
    // Remove rare variant after it has been clicked once
    if (isRareVariant) {
      this.removeButton(buttonId);
    }
  }

  private removeButton(id: string): void {
    const btn = this.container.querySelector(`button[data-id="${id}"]`);
    if (btn) btn.remove();
    this.buttons.delete(id);
  }

  private maybeSpawnVariant(): void {
    // Only one special at a time for MVP
    if ([...this.buttons.values()].some(b => b.variant && b.variant !== ButtonVariant.Normal)) return;
    const roll = Math.random();
    if (roll < 0.02) {
      this.spawnButtonVariant(ButtonVariant.Golden);
    }else if (roll < 0.04) {
      this.spawnButtonVariant(ButtonVariant.Frozen);
    }
  }

  private spawnButtonVariant(variant: ButtonVariant): void {
    const config: ButtonConfig = {
      position: this.getRandomPosition(),
      size: 60,
      speed: this.state.buttonSpeed,
      variant,
      modifiers: [] 
    };
    this.createButton(`${variant}-${Date.now()}`, config);
  }

  private getButtonLabel(variant?: ButtonVariant, modifiers?: ButtonModifier[]): string {
    let label = '';
    switch (variant) {
      case ButtonVariant.Golden: label = '🟡 Golden!'; break;
      case ButtonVariant.Frozen: label = '❄️ Frozen!'; break;
      default: label = 'Click!';
    }
    if (modifiers && modifiers[0] !== ButtonModifier.None) {
      label += ' ' + modifiers.map(m => this.getModifierIcon(m)).join(' ');
    }
    return label;
  }

  private getModifierIcon(mod: ButtonModifier): string {
    switch (mod) {
      case ButtonModifier.Bouncy: return '🟠';
      case ButtonModifier.Hyperactive: return '💨';
      case ButtonModifier.Shrinking: return '🔽';
      case ButtonModifier.ZigZag: return '🟣';
      default: return '';
    }
  }

  private applyModifierEffects(button: HTMLButtonElement, config: ButtonConfig, id: string): void {
    for (const mod of config.modifiers) {
      switch (mod) {
        case ButtonModifier.Bouncy:
          button.style.animation = 'bouncyMove 0.8s infinite cubic-bezier(.68,-0.55,.27,1.55)';
          break;
        case ButtonModifier.Hyperactive:
          button.style.transition = 'left 0.08s linear, top 0.08s linear';
          break;
        case ButtonModifier.Shrinking:
          button.style.transform = 'scale(0.8)';
          break;
        case ButtonModifier.ZigZag:
          this.startBouncingButton(id, button, config);
          break;
      }
    }
  }

  private maybeAddModifier(config: ButtonConfig): void {
    // Only add if no modifiers yet or only 'None'
    if (config.modifiers.length > 0 && (config.modifiers.length > 1 || config.modifiers[0] !== undefined && config.modifiers[0] !== ButtonModifier.None)) return;
    const roll = Math.random();
    if (roll < 0.10) {
      config.modifiers = [ButtonModifier.Bouncy];
    } else if (roll < 0.18) {
      config.modifiers = [ButtonModifier.Hyperactive];
    } else if (roll < 0.22) {
      config.modifiers = [ButtonModifier.Shrinking];
    } else if (roll < 0.27) {
      config.modifiers = [ButtonModifier.ZigZag];
    } else {
      config.modifiers = [ButtonModifier.None];
    }
  }

  private startBouncingButton(id: string, button: HTMLButtonElement, config: ButtonConfig): void {
    // Initial random velocity
    const speed = config.speed * 2 + Math.random();
    let vx = (Math.random() > 0.5 ? 1 : -1) * speed;
    let vy = (Math.random() > 0.5 ? 1 : -1) * speed;
    this.bouncingButtons.set(id, {vx, vy});
    const move = () => {
      if (!this.buttons.has(id)) {
        this.bouncingButtons.delete(id);
        return;
      }
      let pos = this.buttons.get(id)!.position;
      let x = pos.x + vx;
      let y = pos.y + vy;
      const size = config.size;
      const minX = 0;
      const minY = 0;
      const maxX = window.innerWidth - size - 340; // account for upgrades
      const maxY = window.innerHeight - size;
      if (x < minX) { x = minX; vx = -vx; }
      if (x > maxX) { x = maxX; vx = -vx; }
      if (y < minY) { y = minY; vy = -vy; }
      if (y > maxY) { y = maxY; vy = -vy; }
      button.style.left = `${x}px`;
      button.style.top = `${y}px`;
      this.buttons.get(id)!.position = {x, y};
      this.bouncingButtons.set(id, {vx, vy});
      requestAnimationFrame(move);
    };
    move();
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

  private setupDeleteSaveButton(): void {
    const btn = document.getElementById('delete-save-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your save? This cannot be undone.')) {
        localStorage.removeItem('clickDriftSave');
        this.resetGame();
      }
    });
  }

  private resetGame(): void {
    // Remove all buttons
    for (const id of Array.from(this.buttons.keys())) {
      this.removeButton(id);
    }
    // Reset state
    this.state = {
      points: 0,
      clickMultiplier: 1,
      autoClickerRate: 0,
      buttonSpeed: 1,
      upgrades: UpgradeManager.initializeUpgrades()
    };
    this.updateDisplay();
    this.renderUpgrades();
    this.createInitialButton();
    this.checkAutoClickerActivation();
    this.saveGame();
  }

  /**
   * Creates a visual explosion effect for the given variant type.
   */
  private createExplosionEffect(buttonId: string, type: 'golden'  | 'frozen'): void {
    const button = this.container.querySelector(`button[data-id="${buttonId}"]`) as HTMLButtonElement;
    if (!button) return;
    const explosion = document.createElement('div');
    explosion.className = `explosion-effect explosion-${type}`;
    explosion.style.position = 'absolute';
    explosion.style.left = button.style.left;
    explosion.style.top = button.style.top;
    explosion.style.width = button.style.width;
    explosion.style.height = button.style.height;
    explosion.style.zIndex = '200';
    this.container.appendChild(explosion);
    setTimeout(() => explosion.remove(), 600);
  }
}
