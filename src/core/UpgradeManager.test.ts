import { UpgradeManager } from './UpgradeManager';
import { GameState, UpgradeType } from '../types/game.types';

describe('UpgradeManager', () => {
  let initialState: GameState;

  beforeEach(() => {
    initialState = {
      points: 100,
      clickMultiplier: 1,
      autoClickerRate: 0,
      buttonSpeed: 1,
      upgrades: UpgradeManager.initializeUpgrades()
    };
  });

  describe('initializeUpgrades', () => {
    it('should initialize upgrades with correct initial values', () => {
      const upgrades = UpgradeManager.initializeUpgrades();
      
      expect(upgrades['click-power']).toBeDefined();
      expect(upgrades['button-speed']).toBeDefined();
      
      const clickPower = upgrades['click-power'];
      expect(clickPower.level).toBe(0);
      expect(clickPower.type).toBe(UpgradeType.ClickMultiplier);
      expect(clickPower.cost).toBe(10);
      expect(clickPower.maxLevel).toBe(10);
      
      const buttonSpeed = upgrades['button-speed'];
      expect(buttonSpeed.level).toBe(0);
      expect(buttonSpeed.type).toBe(UpgradeType.ButtonSpeed);
      expect(buttonSpeed.cost).toBe(15);
      expect(buttonSpeed.maxLevel).toBe(5);
    });
  });

  describe('canPurchaseUpgrade', () => {
    it('should return true when player has enough points', () => {
      expect(UpgradeManager.canPurchaseUpgrade(initialState, 'click-power')).toBe(true);
    });

    it('should return false when player has insufficient points', () => {
      initialState.points = 5;
      expect(UpgradeManager.canPurchaseUpgrade(initialState, 'click-power')).toBe(false);
    });

    it('should return false when upgrade is at max level', () => {
      initialState.upgrades['click-power'].level = 10;
      expect(UpgradeManager.canPurchaseUpgrade(initialState, 'click-power')).toBe(false);
    });

    it('should return false for non-existent upgrade', () => {
      expect(UpgradeManager.canPurchaseUpgrade(initialState, 'non-existent')).toBe(false);
    });
  });

  describe('purchaseUpgrade', () => {
    it('should correctly purchase click power upgrade', () => {
      const newState = UpgradeManager.purchaseUpgrade(initialState, 'click-power');
      
      expect(newState.points).toBe(90); // 100 - 10
      expect(newState.clickMultiplier).toBe(2); // 2^1
      expect(newState.upgrades['click-power'].level).toBe(1);
      expect(newState.upgrades['click-power'].cost).toBe(20); // 10 * 2
    });

    it('should correctly purchase button speed upgrade', () => {
      const newState = UpgradeManager.purchaseUpgrade(initialState, 'button-speed');
      
      expect(newState.points).toBe(85); // 100 - 15
      expect(newState.buttonSpeed).toBe(1.5); // 1 + (1 * 0.5)
      expect(newState.upgrades['button-speed'].level).toBe(1);
      expect(newState.upgrades['button-speed'].cost).toBe(37); // 15 * 2.5 rounded down
    });

    it('should not modify state when purchase is invalid', () => {
      initialState.points = 5;
      const newState = UpgradeManager.purchaseUpgrade(initialState, 'click-power');
      
      expect(newState).toEqual(initialState);
    });

    it('should handle multiple upgrade purchases correctly', () => {
      let state = UpgradeManager.purchaseUpgrade(initialState, 'click-power');
      state = UpgradeManager.purchaseUpgrade(state, 'click-power');
      
      expect(state.clickMultiplier).toBe(4); // 2^2
      expect(state.upgrades['click-power'].level).toBe(2);
      expect(state.points).toBe(70); // 100 - 10 - 20
    });
  });

  describe('getUpgradeEffect', () => {
    it('should show correct click multiplier effect', () => {
      const upgrade = initialState.upgrades['click-power'];
      const effect = UpgradeManager.getUpgradeEffect(upgrade);
      expect(effect).toBe('1x → 2x CP per click');
    });

    it('should show correct button speed effect', () => {
      const upgrade = initialState.upgrades['button-speed'];
      const effect = UpgradeManager.getUpgradeEffect(upgrade);
      expect(effect).toBe('100% → 150% speed');
    });

    it('should show updated effects after leveling up', () => {
      const state = UpgradeManager.purchaseUpgrade(initialState, 'click-power');
      const effect = UpgradeManager.getUpgradeEffect(state.upgrades['click-power']);
      expect(effect).toBe('2x → 4x CP per click');
    });
  });
});
