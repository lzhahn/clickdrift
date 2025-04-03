export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  points: number;
  clickMultiplier: number;
  autoClickerRate: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  apply: (state: GameState) => GameState;
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
  Exploding = 'exploding',
  Frozen = 'frozen'
}

export enum ButtonModifier {
  None = 'none',
  Bouncy = 'bouncy',
  Hyperactive = 'hyperactive',
  Shrinking = 'shrinking'
}
