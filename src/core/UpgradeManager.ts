import { GameState, Upgrade, UpgradeType } from '../types/game.types';

export class UpgradeManager {
  private static readonly INITIAL_UPGRADES: Upgrade[] = [
    {
      id: 'click-power',
      name: 'Click Power',
      description: 'Double your CP per click',
      cost: 10,
      level: 0,
      maxLevel: 10,
      baseEffect: 1,
      costMultiplier: 2,
      type: UpgradeType.ClickMultiplier,
      purchased: false
    },
    {
      id: 'button-speed',
      name: 'Button Speed',
      description: 'Make the button move faster',
      cost: 15,
      level: 0,
      maxLevel: 5,
      baseEffect: 0.5,
      costMultiplier: 2.5,
      type: UpgradeType.ButtonSpeed,
      purchased: false
    }
  ];

  static initializeUpgrades(): Record<string, Upgrade> {
    const upgrades: Record<string, Upgrade> = {};
    this.INITIAL_UPGRADES.forEach(upgrade => {
      upgrades[upgrade.id] = { ...upgrade };
    });
    return upgrades;
  }

  static canPurchaseUpgrade(state: GameState, upgradeId: string): boolean {
    const upgrade = state.upgrades[upgradeId];
    if (!upgrade) return false;
    
    return state.points >= upgrade.cost && upgrade.level < upgrade.maxLevel;
  }

  static purchaseUpgrade(state: GameState, upgradeId: string): GameState {
    const upgrade = state.upgrades[upgradeId];
    if (!this.canPurchaseUpgrade(state, upgradeId)) return state;

    const newState = { ...state };
    newState.points -= upgrade.cost;

    const updatedUpgrade = { ...upgrade };
    updatedUpgrade.level += 1;
    updatedUpgrade.cost = Math.floor(upgrade.cost * upgrade.costMultiplier);
    updatedUpgrade.purchased = true;

    // Apply upgrade effects
    switch (upgrade.type) {
      case UpgradeType.ClickMultiplier:
        // Double the click multiplier
        newState.clickMultiplier = Math.pow(2, updatedUpgrade.level);
        break;
      case UpgradeType.ButtonSpeed:
        // Increase button speed by 50% per level
        newState.buttonSpeed = 1 + (updatedUpgrade.level * updatedUpgrade.baseEffect);
        break;
      case UpgradeType.AutoClicker:
        newState.autoClickerRate = updatedUpgrade.level * updatedUpgrade.baseEffect;
        break;
    }

    newState.upgrades[upgradeId] = updatedUpgrade;
    return newState;
  }

  static getUpgradeEffect(upgrade: Upgrade): string {
    switch (upgrade.type) {
      case UpgradeType.ClickMultiplier:
        const currentMultiplier = Math.pow(2, upgrade.level);
        const nextMultiplier = Math.pow(2, upgrade.level + 1);
        return `${currentMultiplier}x → ${nextMultiplier}x CP per click`;
      case UpgradeType.ButtonSpeed:
        const currentSpeed = 1 + (upgrade.level * upgrade.baseEffect);
        const nextSpeed = 1 + ((upgrade.level + 1) * upgrade.baseEffect);
        return `${(currentSpeed * 100).toFixed(0)}% → ${(nextSpeed * 100).toFixed(0)}% speed`;
      case UpgradeType.AutoClicker:
        return `${upgrade.level * upgrade.baseEffect} CP/s`;
      default:
        return '';
    }
  }
}
