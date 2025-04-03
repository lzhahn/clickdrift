# ✅ Click Drift Development TODO

This is a step-by-step breakdown for building **Click Drift**, a chaotic incremental clicker game featuring moving buttons, upgrades, and evolving mechanics. Follow these tasks in order to deliver a playable and engaging prototype, and gradually evolve into full-feature release.

---

## 🧱 PHASE 1 – Core Game Loop (MVP)

- [ ] Set up HTML/JS
- [ ] Create a single moving button on screen
  - [ ] Button moves to a random screen location after each click
- [ ] Implement Click Point (CP) system
  - [ ] +1 CP per manual click
  - [ ] CP counter display
- [ ] Add basic upgrade menu
  - [ ] Upgrade: +1 CP per click
  - [ ] Upgrade: Increase movement speed of the button
- [ ] Add basic auto-clicker
  - [ ] Generates CP per second
  - [ ] Upgrade to increase speed/efficiency
- [ ] Save/load system using localStorage

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

## 📲 PHASE 8 – Responsive Layout & Mobile Support

- [ ] Make layout responsive (Flex/Grid or Canvas scaling)
- [ ] Touch input support for tapping buttons
- [ ] Adjust movement speed and button size for mobile UX

---

## 📦 Optional Extras (Stretch Goals)

- [ ] Daily challenge mode
- [ ] Leaderboard integration
- [ ] Import/export save files
- [ ] In-game screenshot or shareable click stats

---

## 🧪 Testing & QA

- [ ] Unit test CP gain logic
- [ ] Test save/load edge cases
- [ ] Performance test with 20+ buttons on screen
- [ ] Ensure all events and upgrades function as expected

---

## 🚀 Release Checklist

- [ ] Bundle and minify assets
- [ ] Ensure save system is stable
- [ ] Add favicon and title metadata
- [ ] Deploy to web host (GitHub Pages, Netlify, etc.)

---

