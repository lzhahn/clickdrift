# ✅ Click Drift Development TODO

This is a step-by-step breakdown for building **Click Drift**, a chaotic incremental clicker game featuring moving buttons, upgrades, and evolving mechanics. Follow these tasks in order to deliver a playable and engaging prototype, and gradually evolve into full-feature release.

---

## 🧱 PHASE 1 – Core Game Loop (MVP)

- [x] Set up HTML/TS
- [x] Create a single moving button on screen
  - [x] Button moves to a random screen location after each click
- [x] Implement Click Point (CP) system
  - [x] +1 CP per manual click
  - [x] CP counter display
- [x] Add basic upgrade menu
  - [x] Upgrade: +1 CP per click
  - [x] Upgrade: Increase movement speed of the button
- [x] Add basic auto-clicker
  - [x] Generates CP per second
  - [x] Upgrade to increase speed/efficiency
- [x] Save/load system using localStorage

---

## 🌀 PHASE 2 – Button Variants + Modifiers

- [ ] Create button variant system
  - [ ] Golden Button (5x CP, rare)
  - [ ] Exploding Button (CP burst on timer click)
  - [ ] Frozen Button (static for bonus CP)
- [ ] Add random spawn system for variants
- [ ] Implement button modifiers system
  - [ ] Modifiers stack with existing variants
  - [ ] Examples:
    - Bouncy
    - Hyperactive
    - Shrinking
- [ ] Create visual markers for each modifier type

---

## 🏗 PHASE 3 – Multi-Button System (Button Factory)

- [ ] Unlock and render multiple buttons on screen
- [ ] Allow slot-based spawning of new buttons
- [ ] Player can configure button slot (type/modifiers)
- [ ] Add simple UI to manage active buttons

---

## ⚙️ PHASE 4 – Advanced Upgrades & Synergies

- [ ] Implement "Weird" upgrades (trigger-based effects)
  - [ ] Echo click
  - [ ] Button clone
  - [ ] Reverse gravity
- [ ] Create rotating shop with upgrade "cards"
  - [ ] Timer or click-based refresh
  - [ ] Reroll button
- [ ] Add combo system
  - [ ] Build multiplier based on rapid clicking
- [ ] Add momentum mechanic
  - [ ] Fast clicking temporarily slows buttons down

---

## 🎉 PHASE 5 – Events & Game Disruptions

- [ ] Swarm event: spawn 10 buttons for a limited time
- [ ] Boss button: HP-based giant button
- [ ] Shadow clone: fake button that punishes wrong click
- [ ] Add event system to trigger above randomly or by milestone

---

## 🧠 PHASE 6 – Progression & Unlocks

- [ ] Implement unlock system for:
  - [ ] Button types
  - [ ] Modifiers
  - [ ] Visual themes
- [ ] Add milestone system:
  - [ ] Triggers new mechanics at CP thresholds or behaviors
- [ ] Add meta-traits that persist without prestige
  - [ ] Passive CP boosts
  - [ ] Modifier synergy boosts

---

## 🧪 PHASE 7 – Achievements, UI Polish, VFX

- [ ] Create achievement tracker
  - [ ] Triggers visual celebration
  - [ ] Cosmetic rewards (e.g. cursor trails, skins)
- [ ] Add particle effects for:
  - [ ] Button click
  - [ ] Variant spawns
- [ ] Polish UI panels:
  - [ ] Upgrade shop
  - [ ] Button factory
  - [ ] Stats/feedback bar

---
