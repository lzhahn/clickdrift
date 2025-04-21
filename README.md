# Click Drift

Click Drift is a retro-inspired incremental clicker game. Click moving buttons, earn points, unlock upgrades, and customize your gameplay with classic UI themes!

## Features
- Moving buttons with click-based point system (CP)
- Multiple button slots and button modifiers
- Upgrades for click power, button speed, auto-clickers, and more
- Unlockable button configuration and modifier system
- Classic UI themes: 7.css, XP.css, 98.css (switchable in-game)
- Auto-save to localStorage
- Built with TypeScript, modular codebase, and clean design patterns

## Getting Started

### Local Development
1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Start the dev server**
   ```sh
   npm start
   ```
3. Open your browser to `http://localhost:3000` (or the port shown)

### Building for Production
```sh
npm run build
```
The output will be in the `dist/` directory.

### GitHub Pages Deployment
- On every push to `main`, the game is built and deployed to the `gh-pages` branch via GitHub Actions.
- Enable GitHub Pages in repo settings, using the `gh-pages` branch as the source.

## Project Structure
- `src/` - Core game code (TypeScript)
- `src/index.html` - Main HTML entry point
- `.github/workflows/` - GitHub Actions CI/CD scripts
- `dist/` - Production build output

## Credits
- [7.css](https://khang-nd.github.io/7.css/) by Khang
- [XP.css](https://botoxparty.github.io/XP.css/) by BotoxParty
- [98.css](https://jdan.github.io/98.css/) by Jordan Scales

## License
MIT
