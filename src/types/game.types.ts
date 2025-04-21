export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  points: number;
  clickMultiplier: number;
  autoClickerRate: number;
  upgrades: Record<string, Upgrade>;
  buttonSpeed: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  baseEffect: number;
  costMultiplier: number;
  type: UpgradeType;
  purchased: boolean;
}

export enum UpgradeType {
  ClickMultiplier = 'clickMultiplier',
  ButtonSpeed = 'buttonSpeed',
  AutoClicker = 'autoClicker'
}

export interface ButtonConfig {
  position: Point;
  size: number;
  speed: number;
  variant?: ButtonVariant;
  modifiers: ButtonModifier[];
}

export enum ButtonVariant {
  Normal = 'normal',
  Golden = 'golden',
  Frozen = 'frozen'
}

export enum ButtonModifier {
  None = 'none',
  Bouncy = 'bouncy',
  Hyperactive = 'hyperactive',
  Shrinking = 'shrinking',
  ZigZag = 'zigzag'
}
