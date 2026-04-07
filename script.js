
let gameState = {
    roundsPlayed: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    history: [],
    tournamentOver: false,
    tournamentWinner: null
};

const WINS_NEEDED = 3;


function loadGameState() {
    const saved = localStorage.getItem('rockPaperScissorsGame');
    if (saved) {
        gameState = JSON.parse(saved);
        updateDisplay();
    }
}


function saveGameState() {
    localStorage.setItem('rockPaperScissorsGame', JSON.stringify(gameState));
}


function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * choices.length)];
}


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


function getEmoji(choice) {
    const emojis = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };
    return emojis[choice];
}


function getChoiceName(choice) {
    return choice.charAt(0).toUpperCase() + choice.slice(1);
}


function playRound(playerChoice) {
    // Check if tournament is already over
    if (gameState.tournamentOver) {
        alert('🏆 Tournament is over! Click "Start New Tournament" to play again.');
        return;
    }

    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    gameState.roundsPlayed++;

    if (result === 'win') {
        gameState.wins++;
    } else if (result === 'lose') {
        gameState.losses++;
    } else {
        gameState.ties++;
    }

    gameState.history.unshift({
        round: gameState.roundsPlayed,
        playerChoice: playerChoice,
        computerChoice: computerChoice,
        result: result
    });

    if (gameState.history.length > 20) {
        gameState.history.pop();
    }

    // Check if someone has won the tournament (first to WINS_NEEDED wins)
    if (gameState.wins === WINS_NEEDED) {
        gameState.tournamentOver = true;
        gameState.tournamentWinner = 'player';
    } else if (gameState.losses === WINS_NEEDED) {
        gameState.tournamentOver = true;
        gameState.tournamentWinner = 'computer';
    }

    saveGameState();
    updateDisplay();
    displayResult(playerChoice, computerChoice, result);
}


function updateDisplay() {
    document.getElementById('roundCount').textContent = gameState.roundsPlayed;
    document.getElementById('winCount').textContent = gameState.wins;
    document.getElementById('lossCount').textContent = gameState.losses;

    // Show tournament result if it's over
    const tournamentInfo = document.getElementById('tournamentInfo');
    if (gameState.tournamentOver) {
        tournamentInfo.style.display = 'block';
        const messageElement = document.getElementById('tournamentMessage');
        
        if (gameState.tournamentWinner === 'player') {
            messageElement.textContent = `🏆 You Won the Tournament! (${gameState.wins}-${gameState.losses}) 🏆`;
            messageElement.style.color = '#27ae60';
        } else if (gameState.tournamentWinner === 'computer') {
            messageElement.textContent = `💻 Computer Won the Tournament! (${gameState.losses}-${gameState.wins}) 💻`;
            messageElement.style.color = '#e74c3c';
        }

        // Disable choice buttons
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = true;
        });
    } else {
        tournamentInfo.style.display = 'none';
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.disabled = false;
        });
    }

    updateHistory();
}

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


    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

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


function resetGame() {
    if (gameState.roundsPlayed === 0) {
        alert('Game not started yet!');
        return;
    }

    if (confirm('Are you sure you want to start a new tournament? All progress will be lost.')) {
        gameState = {
            roundsPlayed: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            history: [],
            tournamentOver: false,
            tournamentWinner: null
        };

        saveGameState();
        updateDisplay();

        document.getElementById('playerMove').textContent = '-';
        document.getElementById('computerMove').textContent = '-';
        document.getElementById('winnerMessage').textContent = '';
        document.getElementById('winnerMessage').classList.remove('win', 'lose', 'tie');
        document.getElementById('tournamentInfo').style.display = 'none';

        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.disabled = false;
        });
    }
}


document.querySelectorAll('.choice-btn').forEach(button => {
    button.addEventListener('click', function() {
        const choice = this.dataset.choice;
        
        
        document.querySelectorAll('.choice-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');

    
        playRound(choice);
    });
});


window.addEventListener('load', loadGameState);
