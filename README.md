# [Tic tac toe four](https://ttt-four.vercel.app/)

This is a strategic twist on the classic tic-tac-toe game. It starts off familiar, but after four moves, the game dynamic shifts. Each player can only have at most four pieces on the board. On the fourth move of each player, if the player placed and did not win, the last piece placed by the player will be tactically removed from the board, adding a new level of strategy to the game.

With this new version, the game never ends in a draw. It's a thrilling battle, always concluding in a win or a loss, adding an extra layer of excitement to each move and keeping you on the edge of your seat.

> "As for the inspiration, one day, I was scrolling through the Instagram reels, and I saw a video of a person playing this version of tic-tac-toe. It was an excellent idea, and I was immediately drawn to it. I decided to bring it to life by creating a web version. I hope you enjoy playing it as much as I enjoyed making it.
> "

## The thoughts behind the game

- The goal is to create a fun and challenging game that is easy to understand and play.
- The game should be aesthetically pleasing.
- It should be easy to play on a mobile device.
- It should contain animations and other micro-interactions to make the game more engaging. (I've used framer, rough-notation, and confetti for this purpose)
- The UI must be clean and purposeful.
- Remember the 404 page.
- The game should have to be keyboard accessible.

# Installation & Offline Play

This game works as a **Progressive Web App (PWA)**, meaning you can:

- **Install it** on your device like a native app
- **Play offline** after your first visit
- Get **fast loading** from cached assets

## How to Install

### On Desktop (Chrome, Edge, Safari)

1. Visit the game in your browser
2. Look for the "Install" button in the address bar or browser menu
3. Click "Install" when prompted
4. The app will be added to your desktop/app launcher

### On Mobile

- **Android (Chrome):** Tap the "Add to Home Screen" notification or use the browser menu
- **iOS (Safari):** Tap Share → "Add to Home Screen"

The install prompt will also appear automatically on supported browsers when you visit the homepage.

## Offline Testing

To verify offline functionality:

1. **Build and run production version:**

   ```bash
   npm run build && npm run start
   ```

2. **Test installation:**
   - Visit `http://localhost:2567`
   - Install the app using your browser's install feature
   - Confirm app appears in your device's app launcher

3. **Test offline play:**
   - Open DevTools → Network tab → Enable "Offline"
   - Reload the app - it should still work
   - Navigate to `/game` and play a full game
   - All functionality should work without network

4. **Check PWA features:**
   - DevTools → Application → Manifest (no errors)
   - DevTools → Application → Service Workers (`sw.js` should be active)
   - Run Lighthouse PWA audit for full validation

**Note:** PWA features are disabled in development mode. Always test with production builds.

# Tech stack

It's a Progressive Web App built with Next.js and Tailwind CSS. The game logic is written in TypeScript and uses Preact Signals for state management. The PWA functionality is powered by `next-pwa` with Workbox. It is hosted on Vercel.

# Future plans

The game is not heavily optimized for performance. I plan to optimize it for better performance, add a feature to play with a friend online and add a feature to play with a bot. Finally, improve the confetti animation.
