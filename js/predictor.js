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

// Achievement system
const ACHIEVEMENTS = {
  'first_bet': { name: '🎯 First Shot', description: 'Place your first bet', points: 50 },
  'lucky_wheel': { name: '🎰 Lucky Spinner', description: 'Spin the wheel 5 times', points: 100 },
  'win_streak_3': { name: '🔥 Hot Streak', description: 'Win 3 bets in a row', points: 200 },
  'win_streak_5': { name: '⚡ Lightning Strike', description: 'Win 5 bets in a row', points: 500 },
  'big_winner': { name: '💰 Big Winner', description: 'Win over 1000 points in one bet', points: 300 },
  'millionaire': { name: '👑 Millionaire', description: 'Reach 10,000 points', points: 1000 },
  'daily_challenge': { name: '📅 Daily Champion', description: 'Complete daily challenge', points: 500 },
  'risk_taker': { name: '💀 Risk Taker', description: 'Bet 500+ points in one go', points: 250 }
};

// Daily challenges
const DAILY_CHALLENGES = [
  { id: 'win_3', text: 'Make 3 correct predictions today!', target: 3, reward: 500 },
  { id: 'bet_total', text: 'Bet a total of 1000 points today!', target: 1000, reward: 300 },
  { id: 'spin_wheel', text: 'Spin the wheel 3 times today!', target: 3, reward: 400 }
];

class PredictorGame {
  constructor() {
    this.balance = this.loadBalance();
    this.bets = this.loadBets();
    this.isSpinning = false;
    this.winStreak = this.loadWinStreak();
    this.achievements = this.loadAchievements();
    this.dailyProgress = this.loadDailyProgress();
    this.wheelSpins = this.loadWheelSpins();
    this.multiplier = 1;
    this.init();
  }

  init() {
    this.updateBalance();
    this.updateStreak();
    this.updateAchievements();
    this.updateDailyChallenge();
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

  loadWinStreak() {
    return parseInt(localStorage.getItem('predictor_streak') || '0');
  }

  saveWinStreak() {
    localStorage.setItem('predictor_streak', this.winStreak.toString());
  }

  loadAchievements() {
    return JSON.parse(localStorage.getItem('predictor_achievements') || '[]');
  }

  saveAchievements() {
    localStorage.setItem('predictor_achievements', JSON.stringify(this.achievements));
  }

  loadDailyProgress() {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('predictor_daily') || '{}');
    if (stored.date !== today) {
      return { date: today, wins: 0, totalBet: 0, wheelSpins: 0 };
    }
    return stored;
  }

  saveDailyProgress() {
    localStorage.setItem('predictor_daily', JSON.stringify(this.dailyProgress));
  }

  loadWheelSpins() {
    return parseInt(localStorage.getItem('predictor_wheel_spins') || '0');
  }

  saveWheelSpins() {
    localStorage.setItem('predictor_wheel_spins', this.wheelSpins.toString());
  }

  updateBalance() {
    const balanceEl = document.getElementById('balance');
    const yourRankEl = document.getElementById('your-rank-points');
    if (balanceEl) {
      balanceEl.textContent = this.balance.toLocaleString();
      // Add pulse animation when balance changes
      balanceEl.classList.add('pulse');
      setTimeout(() => balanceEl.classList.remove('pulse'), 600);
    }
    if (yourRankEl) {
      yourRankEl.textContent = `${this.balance.toLocaleString()} points`;
    }
    
    // Check for millionaire achievement
    if (this.balance >= 10000 && !this.achievements.includes('millionaire')) {
      this.unlockAchievement('millionaire');
    }
  }

  updateStreak() {
    const streakEl = document.getElementById('streak-count');
    if (streakEl) {
      streakEl.textContent = this.winStreak;
    }
  }

  updateAchievements() {
    const previewEl = document.getElementById('achievements-preview');
    if (!previewEl) return;
    
    previewEl.innerHTML = '';
    this.achievements.slice(-3).forEach(achievementId => {
      const achievement = ACHIEVEMENTS[achievementId];
      if (achievement) {
        const badge = document.createElement('span');
        badge.className = 'achievement-badge';
        badge.textContent = achievement.name;
        badge.title = achievement.description;
        previewEl.appendChild(badge);
      }
    });
  }

  updateDailyChallenge() {
    const challenge = DAILY_CHALLENGES[0]; // Use first challenge for demo
    const progressEl = document.getElementById('challenge-progress');
    if (progressEl && challenge) {
      const progress = Math.min((this.dailyProgress.wins / challenge.target) * 100, 100);
      progressEl.style.width = `${progress}%`;
      
      if (progress >= 100 && !this.achievements.includes('daily_challenge')) {
        this.unlockAchievement('daily_challenge');
      }
    }
  }

  updateLeaderboard() {
    // Simple leaderboard update - in a real app this would be server-side
    const yourRankEl = document.getElementById('your-rank-points');
    if (yourRankEl) {
      yourRankEl.textContent = `${this.balance.toLocaleString()} points`;
    }
  }

  unlockAchievement(achievementId) {
    if (this.achievements.includes(achievementId)) return;
    
    this.achievements.push(achievementId);
    this.saveAchievements();
    
    const achievement = ACHIEVEMENTS[achievementId];
    this.balance += achievement.points;
    this.saveBalance();
    this.updateBalance();
    this.updateAchievements();
    
    // Show achievement notification
    this.showNotification(
      `🏆 Achievement Unlocked: ${achievement.name}! +${achievement.points} points`,
      'success'
    );
    
    // Create particles effect
    this.createParticles(document.getElementById('balance'));
  }

  createParticles(element) {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.position = 'fixed';
      particle.style.left = rect.left + rect.width / 2 + 'px';
      particle.style.top = rect.top + rect.height / 2 + 'px';
      particle.style.transform = `translate(${(Math.random() - 0.5) * 100}px, 0)`;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 3000);
    }
  }

  showMultiplier(multiplier) {
    const multiplierEl = document.getElementById('multiplier-display');
    if (!multiplierEl) return;
    
    multiplierEl.textContent = `${multiplier}x MULTIPLIER!`;
    multiplierEl.style.display = 'block';
    
    setTimeout(() => {
      multiplierEl.style.display = 'none';
    }, 2000);
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
    
    // Calculate streak multiplier
    const streakMultiplier = this.winStreak >= 3 ? 1.5 : 1;
    const showMultiplier = streakMultiplier > 1;
    
    card.innerHTML = `
      <div class="match-header">
        <h3>${match.stage}</h3>
        <p>${new Date(match.date).toLocaleDateString()} at ${match.time}</p>
        ${showMultiplier ? `<div style="background: #4ade80; color: white; padding: 0.3rem 0.8rem; border-radius: 12px; font-size: 0.8rem; font-weight: bold; margin-top: 0.5rem;">🔥 ${streakMultiplier}x Streak Bonus!</div>` : ''}
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
          <div class="odds">${(match.odds.team1 * streakMultiplier).toFixed(1)}x</div>
        </div>
        <div class="bet-button" data-match="${match.id}" data-outcome="draw">
          <div><strong>Draw</strong></div>
          <div class="odds">${(match.odds.draw * streakMultiplier).toFixed(1)}x</div>
        </div>
        <div class="bet-button" data-match="${match.id}" data-outcome="team2">
          <div><strong>${match.team2.name} Wins</strong></div>
          <div class="odds">${(match.odds.team2 * streakMultiplier).toFixed(1)}x</div>
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

    // Check for achievements
    if (this.achievements.length === 0) {
      this.unlockAchievement('first_bet');
    }
    
    if (betAmount >= 500 && !this.achievements.includes('risk_taker')) {
      this.unlockAchievement('risk_taker');
    }

    // Place the bet
    this.balance -= betAmount;
    this.saveBalance();
    this.updateBalance();
    
    // Update daily progress
    this.dailyProgress.totalBet += betAmount;
    this.saveDailyProgress();

    // Store bet with streak multiplier
    const streakMultiplier = this.winStreak >= 3 ? 1.5 : 1;
    this.bets[matchId] = { outcome, amount: betAmount, multiplier: streakMultiplier };
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
      // Calculate winnings with multiplier
      const baseWinnings = Math.floor(betAmount * match.odds[actualOutcome]);
      winnings = Math.floor(baseWinnings * (bet.multiplier || 1));
      
      this.balance += winnings;
      this.saveBalance();
      this.updateBalance();
      
      // Update win streak
      this.winStreak++;
      this.saveWinStreak();
      this.updateStreak();
      
      // Update daily progress
      this.dailyProgress.wins++;
      this.saveDailyProgress();
      this.updateDailyChallenge();
      
      // Check for streak achievements
      if (this.winStreak === 3 && !this.achievements.includes('win_streak_3')) {
        this.unlockAchievement('win_streak_3');
      }
      if (this.winStreak === 5 && !this.achievements.includes('win_streak_5')) {
        this.unlockAchievement('win_streak_5');
      }
      
      // Check for big winner achievement
      if (winnings >= 1000 && !this.achievements.includes('big_winner')) {
        this.unlockAchievement('big_winner');
      }
      
      // Show multiplier if applicable
      if (bet.multiplier && bet.multiplier > 1) {
        this.showMultiplier(bet.multiplier);
      }
      
      // Create particles effect
      this.createParticles(document.getElementById('balance'));
      
      this.showNotification(
        `🎉 You won! ${this.getOutcomeText(matchId, actualOutcome)} happened! You earned ${winnings} points!`,
        'success'
      );
    } else {
      // Reset win streak on loss
      this.winStreak = 0;
      this.saveWinStreak();
      this.updateStreak();
      
      this.showNotification(
        `😔 You lost! ${this.getOutcomeText(matchId, actualOutcome)} happened. Better luck next time!`,
        'error'
      );
    }
    
    // Re-render matches to update multipliers
    setTimeout(() => {
      this.renderMatches();
    }, 1000);
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
    
    // Update wheel spins for achievements
    this.wheelSpins++;
    this.saveWheelSpins();
    
    // Update daily progress
    this.dailyProgress.wheelSpins++;
    this.saveDailyProgress();
    
    // Check for wheel achievement
    if (this.wheelSpins >= 5 && !this.achievements.includes('lucky_wheel')) {
      this.unlockAchievement('lucky_wheel');
    }

    const wheel = document.getElementById('fortune-wheel');
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = spins * 360 + Math.random() * 360;
    
    wheel.style.transform = `rotate(${finalRotation}deg)`;

    setTimeout(() => {
      // Better odds for higher prizes if on a streak
      let prizeIndex;
      if (this.winStreak >= 3) {
        prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length * 0.8) + Math.floor(WHEEL_PRIZES.length * 0.2);
        prizeIndex = Math.min(prizeIndex, WHEEL_PRIZES.length - 1);
      } else {
        prizeIndex = Math.floor(Math.random() * WHEEL_PRIZES.length);
      }
      
      const prize = WHEEL_PRIZES[prizeIndex];
      
      this.balance += prize;
      this.saveBalance();
      this.updateBalance();
      
      // Create particles effect
      this.createParticles(wheel);
      
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