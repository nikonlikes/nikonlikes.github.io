import { updateCartCount } from './utils.js';

// Mock match data
const MATCHES = [
  {
    id: 1,
    team1: { name: 'Brazil', code: 'br' },
    team2: { name: 'Argentina', code: 'ar' },
    date: '2026-06-15',
    time: '15:00',
    stage: 'Group Stage',
    odds: { team1: 2.1, draw: 3.2, team2: 2.8 }
  },
  {
    id: 2,
    team1: { name: 'France', code: 'fr' },
    team2: { name: 'England', code: 'gb-eng' },
    date: '2026-06-16',
    time: '18:00',
    stage: 'Group Stage',
    odds: { team1: 2.5, draw: 3.0, team2: 2.2 }
  },
  {
    id: 3,
    team1: { name: 'Spain', code: 'es' },
    team2: { name: 'Germany', code: 'de' },
    date: '2026-06-17',
    time: '20:00',
    stage: 'Group Stage',
    odds: { team1: 2.3, draw: 3.1, team2: 2.4 }
  },
  {
    id: 4,
    team1: { name: 'Netherlands', code: 'nl' },
    team2: { name: 'Portugal', code: 'pt' },
    date: '2026-06-18',
    time: '16:00',
    stage: 'Group Stage',
    odds: { team1: 2.6, draw: 3.3, team2: 2.0 }
  }
];

// Fortune wheel prizes
const WHEEL_PRIZES = [25, 50, 100, 200, 500, 1000];

class PredictorGame {
  constructor() {
    this.balance = this.loadBalance();
    this.bets = this.loadBets();
    this.isSpinning = false;
    this.init();
  }

  init() {
    this.updateBalance();
    this.renderMatches();
    this.bindEvents();
    updateCartCount();
  }

  loadBalance() {
    return parseInt(localStorage.getItem('predictor_balance') || '1000');
  }

  saveBalance() {
    localStorage.setItem('predictor_balance', this.balance.toString());
    this.updateLeaderboard();
  }

  loadBets() {
    return JSON.parse(localStorage.getItem('predictor_bets') || '{}');
  }

  saveBets() {
    localStorage.setItem('predictor_bets', JSON.stringify(this.bets));
  }

  updateBalance() {
    const balanceEl = document.getElementById('balance');
    const yourRankEl = document.getElementById('your-rank-points');
    if (balanceEl) {
      balanceEl.textContent = this.balance.toLocaleString();
    }
    if (yourRankEl) {
      yourRankEl.textContent = `${this.balance.toLocaleString()} points`;
    }
  }

  updateLeaderboard() {
    // Simple leaderboard update - in a real app this would be server-side
    const yourRankEl = document.getElementById('your-rank-points');
    if (yourRankEl) {
      yourRankEl.textContent = `${this.balance.toLocaleString()} points`;
    }
  }

  renderMatches() {
    const container = document.getElementById('matches-container');
    if (!container) return;

    container.innerHTML = '';

    MATCHES.forEach(match => {
      const matchCard = this.createMatchCard(match);
      container.appendChild(matchCard);
    });
  }

  createMatchCard(match) {
    const card = document.createElement('div');
    card.className = 'match-card';
    card.innerHTML = `
      <div class="match-header">
        <h3>${match.stage}</h3>
        <p>${new Date(match.date).toLocaleDateString()} at ${match.time}</p>
      </div>
      
      <div class="teams">
        <div class="team">
          <img src="assets/icons/${match.team1.code}.svg" alt="${match.team1.name}" class="team-flag">
          <strong>${match.team1.name}</strong>
        </div>
        <div class="vs">VS</div>
        <div class="team">
          <img src="assets/icons/${match.team2.code}.svg" alt="${match.team2.name}" class="team-flag">
          <strong>${match.team2.name}</strong>
        </div>
      </div>

      <div class="betting-options">
        <div class="bet-button" data-match="${match.id}" data-outcome="team1">
          <div><strong>${match.team1.name} Wins</strong></div>
          <div class="odds">${match.odds.team1}x</div>
        </div>
        <div class="bet-button" data-match="${match.id}" data-outcome="draw">
          <div><strong>Draw</strong></div>
          <div class="odds">${match.odds.draw}x</div>
        </div>
        <div class="bet-button" data-match="${match.id}" data-outcome="team2">
          <div><strong>${match.team2.name} Wins</strong></div>
          <div class="odds">${match.odds.team2}x</div>
        </div>
      </div>

      <div class="bet-amount">
        <label>Bet Amount:</label>
        <input type="number" class="bet-input" data-match="${match.id}" min="10" max="${this.balance}" value="50">
        <span>points</span>
      </div>

      <div class="quick-bet">
        <button onclick="this.parentNode.previousElementSibling.querySelector('input').value = 25">25</button>
        <button onclick="this.parentNode.previousElementSibling.querySelector('input').value = 50">50</button>
        <button onclick="this.parentNode.previousElementSibling.querySelector('input').value = 100">100</button>
        <button onclick="this.parentNode.previousElementSibling.querySelector('input').value = 250">250</button>
      </div>

      <button class="place-bet-btn" data-match="${match.id}" disabled>
        Select an outcome to place bet
      </button>
    `;

    return card;
  }

  bindEvents() {
    // Bet button selection
    document.addEventListener('click', (e) => {
      if (e.target.closest('.bet-button')) {
        this.handleBetSelection(e.target.closest('.bet-button'));
      }
    });

    // Place bet buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('place-bet-btn')) {
        this.handlePlaceBet(e.target);
      }
    });

    // Fortune wheel
    const wheel = document.getElementById('fortune-wheel');
    if (wheel) {
      wheel.addEventListener('click', () => this.spinWheel());
    }

    // Bet amount validation
    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('bet-input')) {
        this.validateBetAmount(e.target);
      }
    });
  }

  handleBetSelection(button) {
    const matchId = button.dataset.match;
    const outcome = button.dataset.outcome;
    
    // Remove selection from other buttons in this match
    const matchCard = button.closest('.match-card');
    matchCard.querySelectorAll('.bet-button').forEach(btn => {
      btn.classList.remove('selected');
    });
    
    // Select this button
    button.classList.add('selected');
    
    // Enable place bet button
    const placeBetBtn = matchCard.querySelector('.place-bet-btn');
    placeBetBtn.disabled = false;
    placeBetBtn.textContent = 'Place Bet';
    placeBetBtn.dataset.outcome = outcome;
  }

  handlePlaceBet(button) {
    const matchId = parseInt(button.dataset.match);
    const outcome = button.dataset.outcome;
    const matchCard = button.closest('.match-card');
    const betInput = matchCard.querySelector('.bet-input');
    const betAmount = parseInt(betInput.value);

    if (!outcome) {
      this.showNotification('Please select an outcome first!', 'warning');
      return;
    }

    if (betAmount < 10) {
      this.showNotification('Minimum bet is 10 points!', 'warning');
      return;
    }

    if (betAmount > this.balance) {
      this.showNotification('Not enough points!', 'error');
      return;
    }

    // Place the bet
    this.balance -= betAmount;
    this.saveBalance();
    this.updateBalance();

    // Store bet
    this.bets[matchId] = { outcome, amount: betAmount };
    this.saveBets();

    // Simulate immediate result (for demo purposes)
    setTimeout(() => {
      this.simulateMatchResult(matchId, betAmount);
    }, 2000);

    // Disable betting for this match
    matchCard.querySelectorAll('.bet-button, .place-bet-btn, .bet-input').forEach(el => {
      el.disabled = true;
    });
    button.textContent = 'Bet Placed! Waiting for result...';

    this.showNotification(`Bet placed: ${betAmount} points on ${this.getOutcomeText(matchId, outcome)}!`, 'success');
  }

  simulateMatchResult(matchId, betAmount) {
    const match = MATCHES.find(m => m.id === matchId);
    const bet = this.bets[matchId];
    
    // Random result (33% chance for each outcome)
    const outcomes = ['team1', 'draw', 'team2'];
    const actualOutcome = outcomes[Math.floor(Math.random() * 3)];
    
    let winnings = 0;
    if (bet.outcome === actualOutcome) {
      winnings = Math.floor(betAmount * match.odds[actualOutcome]);
      this.balance += winnings;
      this.saveBalance();
      this.updateBalance();
      
      this.showNotification(
        `🎉 You won! ${this.getOutcomeText(matchId, actualOutcome)} happened! You earned ${winnings} points!`,
        'success'
      );
    } else {
      this.showNotification(
        `😔 You lost! ${this.getOutcomeText(matchId, actualOutcome)} happened. Better luck next time!`,
        'error'
      );
    }
  }

  getOutcomeText(matchId, outcome) {
    const match = MATCHES.find(m => m.id === matchId);
    switch(outcome) {
      case 'team1': return `${match.team1.name} wins`;
      case 'draw': return 'Draw';
      case 'team2': return `${match.team2.name} wins`;
      default: return 'Unknown';
    }
  }

  validateBetAmount(input) {
    const value = parseInt(input.value);
    const max = Math.min(this.balance, 1000);
    
    if (value > max) {
      input.value = max;
    }
    if (value < 10 && input.value !== '') {
      input.value = 10;
    }
  }

  spinWheel() {
    if (this.isSpinning) return;
    
    if (this.balance < 50) {
      this.showNotification('You need at least 50 points to spin!', 'warning');
      return;
    }

    this.isSpinning = true;
    this.balance -= 50;
    this.saveBalance();
    this.updateBalance();

    const wheel = document.getElementById('fortune-wheel');
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = spins * 360 + Math.random() * 360;
    
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
      const prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
      const prize = WHEEL_PRIZES[prizeIndex];
      
      this.balance += prize;
      this.saveBalance();
      this.updateBalance();
      
      this.showNotification(`🎰 You won ${prize} points!`, 'success');
      this.isSpinning = false;
    }, 2000);
  }

  showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PredictorGame();
});

// Add some fun console messages
console.log('🏆 Welcome to World Cup Predictor!');
console.log('💡 Pro tip: The house always wins... but not today! 😉');
console.log('🎰 Try the lucky wheel for bonus points!'); 