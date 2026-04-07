# Rock Paper Scissors Game 🎮

A modern, interactive Rock Paper Scissors game built with HTML, CSS, and JavaScript.

## Features

### Basic Features
- 🎮 **Play against the computer** - Random AI opponent
- 📊 **Track rounds played** - See how many games you've played
- 🔄 **Reset button** - Start fresh anytime
- 🏆 **Winner display** - Clear indication of who won each round

### Advanced Features
- 📜 **Move history** - View your last 20 moves with results
- 🔥 **Streak tracker** - Track your consecutive wins/losses
- 💾 **Auto-save** - Your game progress is saved automatically
- 📱 **Responsive design** - Works perfectly on mobile and desktop

## How to Play

1. Open `index.html` in your web browser
2. Click on Rock 🪨, Paper 📄, or Scissors ✂️
3. Computer makes a random choice
4. See the result and track your stats
5. Use the Reset button to start a new game

## Game Rules

- **Rock** beats **Scissors**
- **Scissors** beats **Paper**
- **Paper** beats **Rock**
- Same choice = Tie

## Files

- `index.html` - Main HTML structure
- `style.css` - Styling and responsive design
- `script.js` - Game logic and state management

## Features in Detail

### Move History
- Shows up to 20 recent moves
- Color-coded by result (green=win, red=loss, orange=tie)
- Displays round number, both choices, and outcome

### Streak Tracker
- Tracks consecutive wins (green indicator)
- Tracks consecutive losses (red indicator)
- Resets on ties
- Visible in the stats section

### Data Persistence
- Game state is saved to browser's localStorage
- Automatically loads when you revisit
- Close and reopen without losing progress

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Author

Created by Shubham

Enjoy playing! 🎉
