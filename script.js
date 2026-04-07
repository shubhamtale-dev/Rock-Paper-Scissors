// Game State
let gameState = {
    roundsPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    currentStreak: 0,
    streakType: null, // 'win' or 'loss'
    history: []
};

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('rockPaperScissorsGame');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
    }
}

// Save game state to localStorage
function saveGameState() {
    localStorage.setItem('rockPaperScissorsGame', JSON.stringify(gameState));
}

// Get computer's random choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}

// Determine the winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }

    return 'lose';
}

// Get emoji for choice
function getEmoji(choice) {
    const emojis = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };
    return emojis[choice];
}

// Get choice name
function getChoiceName(choice) {
    return choice.charAt(0).toUpperCase() + choice.slice(1);
}

// Play a round
function playRound(playerChoice) {
    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    // Update game state
    gameState.roundsPlayed++;

    if (result === 'win') {
        gameState.wins++;
        if (gameState.streakType === 'win') {
            gameState.currentStreak++;
        } else {
            gameState.currentStreak = 1;
            gameState.streakType = 'win';
        }
    } else if (result === 'lose') {
        gameState.losses++;
        if (gameState.streakType === 'loss') {
            gameState.currentStreak++;
        } else {
            gameState.currentStreak = 1;
            gameState.streakType = 'loss';
        }
    } else {
        gameState.ties++;
        gameState.currentStreak = 0;
        gameState.streakType = null;
    }

    // Add to history
    gameState.history.unshift({
        round: gameState.roundsPlayed,
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        result: result
    });

    // Keep only last 20 rounds in history
    if (gameState.history.length > 20) {
        gameState.history.pop();
    }

    // Save state
    saveGameState();

    // Update display
    updateDisplay();
    displayResult(playerChoice, computerChoice, result);
}

// Update display
function updateDisplay() {
    document.getElementById('roundCount').textContent = gameState.roundsPlayed;
    document.getElementById('winCount').textContent = gameState.wins;
    
    // Update streak display based on streak type
    if (gameState.streakType === 'win') {
        document.getElementById('streakCount').textContent = gameState.currentStreak;
        document.getElementById('streakCount').parentElement.style.color = '#27ae60';
    } else if (gameState.streakType === 'loss') {
        document.getElementById('streakCount').textContent = gameState.currentStreak;
        document.getElementById('streakCount').parentElement.style.color = '#e74c3c';
    } else {
        document.getElementById('streakCount').textContent = '0';
        document.getElementById('streakCount').parentElement.style.color = '';
    }

    updateHistory();
}

// Display result
function displayResult(playerChoice, computerChoice, result) {
    document.getElementById('playerMove').textContent = getEmoji(playerChoice);
    document.getElementById('computerMove').textContent = getEmoji(computerChoice);

    const messageElement = document.getElementById('winnerMessage');
    messageElement.classList.remove('win', 'lose', 'tie');

    if (result === 'win') {
        messageElement.textContent = '🎉 You Won!';
        messageElement.classList.add('win');
    } else if (result === 'lose') {
        messageElement.textContent = '😢 Computer Won!';
        messageElement.classList.add('lose');
    } else {
        messageElement.textContent = '🤝 It\'s a Tie!';
        messageElement.classList.add('tie');
    }

    // Remove active state from all buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Update history display
function updateHistory() {
    const historyContainer = document.getElementById('historyContainer');
    
    if (gameState.history.length === 0) {
        historyContainer.innerHTML = '<p class="empty-history">No moves yet. Start playing!</p>';
        return;
    }

    historyContainer.innerHTML = gameState.history.map(item => {
        const resultClass = item.result;
        const resultText = item.result === 'win' ? 'WIN' : item.result === 'lose' ? 'LOSS' : 'TIE';
        
        return `
            <div class="history-item ${resultClass}">
                <span class="round-number">Round ${item.round}</span>
                <span class="move-info">
                    ${getEmoji(item.playerChoice)} vs ${getEmoji(item.computerChoice)}
                </span>
                <span class="result-badge ${resultClass}">${resultText}</span>
            </div>
        `;
    }).join('');
}

// Reset game
function resetGame() {
    if (gameState.roundsPlayed === 0) {
        alert('Game not started yet!');
        return;
    }

    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        gameState = {
            roundsPlayed: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            currentStreak: 0,
            streakType: null,
            history: []
        };

        saveGameState();
        updateDisplay();

        // Reset display
        document.getElementById('playerMove').textContent = '-';
        document.getElementById('computerMove').textContent = '-';
        document.getElementById('winnerMessage').textContent = '';
        document.getElementById('winnerMessage').classList.remove('win', 'lose', 'tie');

        // Remove active state from all buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
}

// Event listeners
document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', function() {
        const choice = this.dataset.choice;
        
        // Add active class
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');

        // Play the round
        playRound(choice);
    });
});

// Load saved game state on page load
window.addEventListener('load', loadGameState);
