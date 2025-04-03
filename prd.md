# Product Requirements Document (PRD)
## Project: Click Drift
## Type: Incremental Game

---

### 📌 Overview

**Click Drift** is an incremental web-based clicker game where players generate resources by clicking a button that moves randomly across the screen. The game builds engagement through evolving mechanics such as multiple button types, upgrades, auto-clickers, and chaotic button behaviors. There is no prestige system; instead, long-term progression is embedded in the core gameplay via unlocks, traits, and variant stacking.

---

## 🎮 Core Gameplay Loop

1. Player clicks a **moving button** to earn Click Points (CP).
2. The button **teleports or moves** to a new location after each click.
3. Player spends CP on:
   - Upgrades
   - Auto-clickers
   - Unlocking new button types
4. Game becomes increasingly automated and chaotic.

---

## 🔧 Core Systems

### 1. Click Points (CP)
- Primary currency.
- Earned via manual clicks, auto-clickers, and special button variants.
- Spent on upgrades and button enhancements.

---

### 2. Moving Button
- Starts as a single button.
- Moves randomly (teleport, arc, bounce).
- Movement behavior may be modified via upgrades.

---

### 3. Auto Clickers
- Automatically generate CP.
- Types:
  - **Basic Clicker:** Passive CP/s.
  - **Visual Clicker:** Simulates screen clicks.
  - **Smart Clicker:** Tracks and clicks moving buttons.
- Upgradable for efficiency, speed, and targeting.

---

## 🧩 Mechanics & Features

### 1. Button Variants (Core Feature)
- Buttons with different behaviors and rewards.
- Spawn based on milestones or event triggers.

| Variant          | Behavior |
|------------------|----------|
| Golden           | High CP burst. Rare. |
| Exploding        | Timed click challenge. |
| Frozen           | Static button. Bonus CP. |
| Ghost            | Flickers. CP if clicked while visible. |
| Magnet           | Drifts toward cursor. Proximity bonus. |
| Wildcard         | Random effect on click. |

---

### 2. Button Modifiers (Stacking Traits)
- Adds complexity to button behavior.
- Stackable effects (1–3 per button).
- Examples:
  - Bouncy
  - Hyperactive
  - Shrinking
  - Combo-sensitive

---

### 3. Button Factory (Multi-button System)
- Unlock additional button slots.
- Each button is configurable (type + modifiers).
- Player builds and manages their own chaotic field.

---

### 4. Upgrade System
- Linear and nonlinear upgrades purchasable via CP.
- Categories:
  - Manual click bonuses
  - Auto-clicker enhancements
  - Movement modifiers
  - Special abilities

---

### 5. “Weird” Upgrades (Random Effects)
- Rare and powerful upgrades with unpredictable effects.
- Triggered via events, challenges, or dynamic shop.
- Examples:
  - Clone a button
  - Echo click
  - Reverse gravity
  - Cursor tracking

---

### 6. Combo & Momentum Mechanics
- **Combo Meter**: Builds with rapid clicking; gives temporary CP multiplier.
- **Momentum**: Fast clicking slows down button movement temporarily.

---

### 7. Dynamic Upgrade Shop
- Rotating upgrade cards with random offerings.
- Adds strategic decisions.
- Refresh timer or click-based refresh.

---

### 8. Game Events (Encounters)
- Random mid-game triggers.
- Examples:
  - Swarm (10 buttons at once)
  - Boss Button (CP reward for clicking multiple times)
  - Shadow Clone (mimic button)

---

## 🧱 Progression System

- No prestige/reset system.
- Progression based on:
  - Button type unlocks
  - Modifier stacking
  - Upgrade tree
  - Long-term CP income scaling
  - Meta traits unlocked by challenges

---

## 🧠 Challenge & Achievement System
- Challenge tasks unlock:
  - Button types
  - Modifiers
  - Visual skins or backgrounds
- Achievements for player retention, no mechanical impact required.

---

## 🖥 Technical Considerations

- **Platform**: Web-based (HTML/JS or React/Canvas).
- **Storage**: LocalStorage or IndexedDB (autosave every 10s).
- **Target FPS**: 60 for smooth motion.
- **Resolution scaling**: Support full-screen and mobile via responsive layout.

---

## 🔄 Milestone Feature Plan

| Phase | Features |
|-------|----------|
| Alpha | Single button, CP system, upgrades, auto clickers |
| Beta  | Button variants, modifiers, shop, dynamic upgrade cards |
| v1.0  | Button Factory, weird upgrades, events, challenge unlocks |
| v1.1+ | Customization, accessibility features, balance tuning |

---

## 📁 Assets & UI

- **Buttons**: Circular, distinct colors for each variant.
- **Modifiers**: Icon overlays (e.g., lightning for speed).
- **Click feedback**: Floating numbers, light particles.
- **UI Panels**:
  - Sidebar for CP, upgrades, and buttons
  - Top bar for stats
  - Popup events (for swarm, boss, etc.)

---

## 📊 Success Metrics

- Session length
- Buttons clicked per minute
- Retention after 1 hour
- % of players using 3+ buttons
- Completion of challenge/achievement milestones

---
