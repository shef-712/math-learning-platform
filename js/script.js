// ============================================================
// MATH MASTERY - Complete JavaScript Application
// Features: Auth, Quiz, Scoring, XP, Achievements, Leaderboard
// ============================================================

// ============================================================
// INITIALIZATION & UTILITIES
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadThemePreference();
    setupThemeToggle();
    checkAuthStatus();
    loadDashboardData();
    setupEventListeners();
    initializeDemoAccount();
}

// Theme Management
function loadThemePreference() {
    const isDarkMode = localStorage.getItem('mathmastery_dark_mode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        updateThemeToggle();
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('mathmastery_dark_mode', isDarkMode);
    updateThemeToggle();
}

function updateThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
}

// Initialize Demo Account
function initializeDemoAccount() {
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    if (!users['demo@mathmastery.com']) {
        users['demo@mathmastery.com'] = {
            id: 'user_' + Date.now(),
            fullName: 'Demo User',
            username: 'demouser',
            email: 'demo@mathmastery.com',
            password: 'Demo123456',
            avatar: '👤',
            createdAt: new Date().toISOString(),
            stats: {
                totalQuestions: 150,
                correctAnswers: 127,
                wrongAnswers: 23,
                totalPoints: 2500,
                level: 4,
                xp: 750,
                currentStreak: 12,
                highestScore: 95,
                accuracy: 84.67
            },
            achievements: ['beginner', 'learner', 'advanced', 'expert'],
            dailyChallengeDate: null
        };
        localStorage.setItem('mathmastery_users', JSON.stringify(users));
    }
}

// ============================================================
// AUTHENTICATION SYSTEM
// ============================================================

function checkAuthStatus() {
    const currentUser = getCurrentUser();
    const logoutBtns = document.querySelectorAll('#logoutBtn');
    
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', logout);
    });

    // Hide auth buttons if logged in
    if (currentUser && window.location.pathname.includes('.html') && !window.location.pathname.includes('dashboard') && !window.location.pathname.includes('quiz') && !window.location.pathname.includes('profile')) {
        const navAuth = document.querySelector('.navbar-auth');
        if (navAuth) {
            navAuth.innerHTML = `
                <button class="btn-theme-toggle" id="themeToggle">🌙</button>
                <button class="btn btn-secondary" id="logoutBtn">Logout</button>
            `;
            document.getElementById('themeToggle').addEventListener('click', toggleTheme);
            document.getElementById('logoutBtn').addEventListener('click', logout);
        }
    }
}

// Registration Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegistration);
}

function handleRegistration(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (!fullName) {
        showError('fullNameError', 'Full name is required');
        return;
    }
    if (!username) {
        showError('usernameError', 'Username is required');
        return;
    }
    if (!email || !isValidEmail(email)) {
        showError('emailError', 'Valid email is required');
        return;
    }
    if (password.length < 8) {
        showError('passwordError', 'Password must be at least 8 characters');
        return;
    }
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
    }

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    if (users[email]) {
        showError('emailError', 'Email already registered');
        return;
    }

    // Create user
    const newUser = {
        id: 'user_' + Date.now(),
        fullName,
        username,
        email,
        password: btoa(password), // Simple encoding
        avatar: getRandomAvatar(),
        createdAt: new Date().toISOString(),
        stats: {
            totalQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            totalPoints: 0,
            level: 1,
            xp: 0,
            currentStreak: 0,
            highestScore: 0,
            accuracy: 0
        },
        achievements: [],
        dailyChallengeDate: null
    };

    users[email] = newUser;
    localStorage.setItem('mathmastery_users', JSON.stringify(users));
    
    // Show success modal
    document.getElementById('successModal').classList.remove('hidden');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Login Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    const user = users[email];

    if (!user || atob(user.password) !== password) {
        showError('loginEmailError', 'Invalid email or password');
        return;
    }

    // Login successful
    localStorage.setItem('mathmastery_current_user', email);
    if (rememberMe) {
        localStorage.setItem('mathmastery_remember_me', 'true');
    }

    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('mathmastery_current_user');
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const email = localStorage.getItem('mathmastery_current_user');
    if (!email) return null;
    
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    return users[email];
}

function getUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    return users[email];
}

function saveUser(email, userData) {
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    users[email] = userData;
    localStorage.setItem('mathmastery_users', JSON.stringify(users));
}

// ============================================================
// VALIDATION & HELPERS
// ============================================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '🙈';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

function getRandomAvatar() {
    const avatars = ['👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🔬', '👩‍🔬', '🧑‍🏫'];
    return avatars[Math.floor(Math.random() * avatars.length)];
}

// Monitor password strength
const passwordInput = document.getElementById('password');
if (passwordInput) {
    passwordInput.addEventListener('input', updatePasswordStrength);
}

function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.getElementById('strengthBar');
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    
    strengthBar.style.width = strength + '%';
    
    if (strength < 50) strengthBar.style.background = '#EF4444';
    else if (strength < 75) strengthBar.style.background = '#F59E0B';
    else strengthBar.style.background = '#10B981';
}

// ============================================================
// DASHBOARD
// ============================================================

function loadDashboardData() {
    const user = getCurrentUser();
    if (!user) return;

    // Load user info
    document.getElementById('userName') && (document.getElementById('userName').textContent = user.fullName);
    document.getElementById('userUsername') && (document.getElementById('userUsername').textContent = '@' + user.username);
    document.getElementById('userAvatar') && (document.getElementById('userAvatar').textContent = user.avatar);

    // Load stats
    document.getElementById('currentLevel') && (document.getElementById('currentLevel').textContent = user.stats.level);
    document.getElementById('totalPoints') && (document.getElementById('totalPoints').textContent = user.stats.totalPoints);
    document.getElementById('questionsSolved') && (document.getElementById('questionsSolved').textContent = user.stats.totalQuestions);
    document.getElementById('accuracy') && (document.getElementById('accuracy').textContent = Math.round(user.stats.accuracy) + '%');
    document.getElementById('correctAnswers') && (document.getElementById('correctAnswers').textContent = user.stats.correctAnswers);
    document.getElementById('wrongAnswers') && (document.getElementById('wrongAnswers').textContent = user.stats.wrongAnswers);
    document.getElementById('currentStreak') && (document.getElementById('currentStreak').textContent = user.stats.currentStreak + ' 🔥');

    // Update progress
    const xpPerLevel = 100 * (Math.pow(1.5, user.stats.level - 1));
    const xpForNextLevel = 100 * (Math.pow(1.5, user.stats.level));
    const currentLevelXp = user.stats.xp - (xpPerLevel - 100);
    const progressPercent = (currentLevelXp / (xpForNextLevel - xpPerLevel)) * 100;
    
    if (document.getElementById('progressFill')) {
        document.getElementById('progressFill').style.width = Math.min(progressPercent, 100) + '%';
        document.getElementById('xpLabel').textContent = Math.round(currentLevelXp) + ' / ' + Math.round(xpForNextLevel - xpPerLevel) + ' XP';
    }

    // Load leaderboard rank
    updateUserRank();

    // Load achievements
    loadAchievements();

    // Check daily challenge
    checkDailyChallenge();
}

function updateUserRank() {
    const user = getCurrentUser();
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    
    let rank = 1;
    for (const email in users) {
        if (users[email].stats.totalPoints > user.stats.totalPoints) {
            rank++;
        }
    }

    if (document.getElementById('userRank')) {
        document.getElementById('userRank').textContent = '#' + rank;
    }
    if (document.getElementById('yourRankPosition')) {
        document.getElementById('yourRankPosition').textContent = '#' + rank;
    }
    if (document.getElementById('yourRankName')) {
        document.getElementById('yourRankName').textContent = user.username;
    }
    if (document.getElementById('yourRankScore')) {
        document.getElementById('yourRankScore').textContent = user.stats.totalPoints + ' points';
    }
    if (document.getElementById('yourRankLevel')) {
        const levels = ['Beginner', 'Learner', 'Advanced', 'Expert', 'Master'];
        document.getElementById('yourRankLevel').textContent = 'Level ' + user.stats.level;
    }
}

// Achievements System
const ACHIEVEMENTS = {
    beginner: { name: 'Beginner', icon: '🌱', requirement: 10, type: 'questions' },
    learner: { name: 'Learner', icon: '📚', requirement: 50, type: 'questions' },
    advanced: { name: 'Advanced', icon: '🚀', requirement: 100, type: 'questions' },
    expert: { name: 'Expert', icon: '⭐', requirement: 500, type: 'points' },
    master: { name: 'Master', icon: '👑', requirement: 2000, type: 'points' }
};

function loadAchievements() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById('achievementsContainer');
    const grid = document.getElementById('achievementsGrid');

    if (!container && !grid) return;

    let html = '';

    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        const isUnlocked = user.achievements.includes(key);
        const currentValue = achievement.type === 'questions' ? user.stats.totalQuestions : user.stats.totalPoints;
        const progress = Math.round((currentValue / achievement.requirement) * 100);

        html += `
            <div class="achievement-badge ${isUnlocked ? '' : 'locked'}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-progress">${Math.min(progress, 100)}%</div>
            </div>
        `;
    }

    if (container) {
        container.innerHTML = html;
    }
    if (grid) {
        grid.innerHTML = html;
    }
}

function checkAndUnlockAchievements(user) {
    for (const [key, achievement] of Object.entries(ACHIEVEMENTS)) {
        if (user.achievements.includes(key)) continue;

        const currentValue = achievement.type === 'questions' ? user.stats.totalQuestions : user.stats.totalPoints;
        
        if (currentValue >= achievement.requirement) {
            user.achievements.push(key);
            showNotification(`🎉 Achievement Unlocked: ${achievement.name}!`);
        }
    }
}

function checkDailyChallenge() {
    const user = getCurrentUser();
    if (!user) return;

    const today = new Date().toDateString();
    const lastChallengeDate = user.dailyChallengeDate;
    
    const badgeEl = document.getElementById('dailyBadge');
    if (lastChallengeDate === today) {
        if (badgeEl) badgeEl.textContent = 'Completed';
    } else {
        if (badgeEl) badgeEl.textContent = 'Available';
    }
}

// ============================================================
// QUIZ SYSTEM
// ============================================================

// Difficulty-based timing configuration
const DIFFICULTY_TIMINGS = {
    easy: 60,      // 60 seconds for easy questions
    medium: 45,    // 45 seconds for medium questions
    hard: 40,      // 40 seconds for hard questions
    expert: 30,    // 30 seconds for expert questions
    master: 20     // 20 seconds for master questions
};

let currentQuiz = {
    difficulty: null,
    questions: [],
    currentIndex: 0,
    score: 0,
    answers: [],
    startTime: null,
    timePerQuestion: 30,
    selectedAnswer: null
};

const QUESTIONS_DB = {
    easy: [
        { question: '15 + 8 = ?', options: ['20', '23', '25', '18'], correct: 1 },
        { question: '25 - 12 = ?', options: ['12', '13', '14', '15'], correct: 0 },
        { question: '7 × 6 = ?', options: ['40', '42', '44', '46'], correct: 1 },
        { question: '48 ÷ 6 = ?', options: ['6', '7', '8', '9'], correct: 2 },
        { question: '100 - 45 = ?', options: ['55', '56', '57', '58'], correct: 0 },
        { question: '9 + 11 = ?', options: ['19', '20', '21', '22'], correct: 1 },
        { question: '30 ÷ 5 = ?', options: ['5', '6', '7', '8'], correct: 1 },
        { question: '12 × 3 = ?', options: ['35', '36', '37', '38'], correct: 1 },
        { question: '50 + 25 = ?', options: ['74', '75', '76', '77'], correct: 1 },
        { question: '99 - 50 = ?', options: ['48', '49', '50', '51'], correct: 1 }
    ],
    medium: [
        { question: '3/4 + 1/4 = ?', options: ['1', '1.5', '2', '0.75'], correct: 0 },
        { question: '25% of 80 = ?', options: ['15', '20', '25', '30'], correct: 1 },
        { question: '0.5 × 0.8 = ?', options: ['0.2', '0.3', '0.4', '0.5'], correct: 2 },
        { question: 'Solve: 2x + 5 = 13', options: ['3', '4', '5', '6'], correct: 1 },
        { question: '15% of 200 = ?', options: ['25', '30', '35', '40'], correct: 1 },
        { question: '5² = ?', options: ['20', '24', '25', '30'], correct: 2 },
        { question: '√64 = ?', options: ['6', '7', '8', '9'], correct: 2 },
        { question: '3/5 = ?%', options: ['50', '60', '70', '80'], correct: 1 },
        { question: 'If x = 3, then 2x + 1 = ?', options: ['6', '7', '8', '9'], correct: 1 },
        { question: '12.5% of 400 = ?', options: ['40', '50', '60', '70'], correct: 1 }
    ],
    hard: [
        { question: 'Solve: 3x² - 9 = 0', options: ['±1', '±2', '±3', '±4'], correct: 2 },
        { question: 'sin(90°) = ?', options: ['0', '0.5', '1', '2'], correct: 2 },
        { question: 'If tan(θ) = 1, then θ = ?', options: ['30°', '45°', '60°', '90°'], correct: 1 },
        { question: 'cos(0°) = ?', options: ['0', '0.5', '1', '-1'], correct: 2 },
        { question: 'Solve: x² - 5x + 6 = 0', options: ['2, 3', '1, 6', '2, 4', '3, 4'], correct: 0 },
        { question: 'Area of circle with r=5: ?', options: ['31.4', '47.1', '78.5', '157'], correct: 2 },
        { question: 'log₁₀(100) = ?', options: ['1', '2', '10', '100'], correct: 1 },
        { question: 'If f(x) = x² + 1, f(3) = ?', options: ['8', '9', '10', '11'], correct: 2 },
        { question: 'Derivative of x³ = ?', options: ['x²', '3x²', '3x', 'x'], correct: 1 },
        { question: 'cos(60°) = ?', options: ['0', '0.5', '√3/2', '1'], correct: 1 }
    ],
    expert: [
        { question: 'Integral of e^x = ?', options: ['e^x', 'e^x + C', 'xe^x', 'e^(x+1)'], correct: 1 },
        { question: 'P(A∩B) = ?', options: ['P(A)+P(B)', 'P(A)×P(B)', 'P(A)-P(B)', 'P(A)/P(B)'], correct: 1 },
        { question: 'Solve: e^x = 10', options: ['ln(10)', 'log(10)', '10^e', 'e/10'], correct: 0 },
        { question: 'Limit as x→0 of sin(x)/x = ?', options: ['0', '0.5', '1', '∞'], correct: 2 },
        { question: 'Standard deviation measures:', options: ['mean', 'spread', 'median', 'mode'], correct: 1 },
        { question: 'Probability coin lands heads twice:', options: ['0.25', '0.5', '0.75', '1'], correct: 0 },
        { question: '∫₀¹ x² dx = ?', options: ['1/3', '1/2', '2/3', '1'], correct: 0 },
        { question: 'Fourier series uses:', options: ['polynomials', 'trig functions', 'exponentials', 'logarithms'], correct: 1 },
        { question: 'Sample size for 95% CI:', options: ['30', '50', '100', 'depends on σ'], correct: 3 },
        { question: 'Central Limit Theorem states:', options: ['means are normal', 'data is normal', 'variance is zero', 'all distributions equal'], correct: 0 }
    ],
    master: [
        { question: 'Riemann Hypothesis concerns:', options: ['primes', 'zeta function', 'infinity', 'dimensions'], correct: 1 },
        { question: 'Gödel\'s Incompleteness: ', options: ['no consistency proof', 'infinite solutions', 'perfect systems', 'all proofs exist'], correct: 0 },
        { question: 'Fermat\'s Last Theorem: no solution for', options: ['a+b=c', 'a²+b²=c²', 'aⁿ+bⁿ=cⁿ (n>2)', 'ab=c'], correct: 2 },
        { question: 'Hausdorff dimension example:', options: ['integer', 'rational', 'irrational', 'complex'], correct: 2 },
        { question: 'Noncommutative geometry involves:', options: ['matrices', 'spaces', 'beyond commutativity', 'linear algebra'], correct: 2 },
        { question: 'Catastrophe theory studies:', options: ['disasters', 'discontinuities', 'topology', 'physics'], correct: 1 },
        { question: 'Ergodic theory applies to:', options: ['dynamics', 'statistics', 'chaos', 'all of above'], correct: 3 },
        { question: 'Calabi-Yau manifolds are:', options: ['physical', 'mathematical', 'both', 'neither'], correct: 2 },
        { question: 'Knot theory invariants include:', options: ['Jones', 'Alexander', 'Kauffman', 'all'], correct: 3 },
        { question: 'Yang-Mills existence: ', options: ['solved', 'unsolved', 'impossible', 'trivial'], correct: 1 }
    ]
};

function selectDifficulty(difficulty) {
    currentQuiz.difficulty = difficulty;
    currentQuiz.questions = getRandomQuestions(QUESTIONS_DB[difficulty], 10);
    currentQuiz.currentIndex = 0;
    currentQuiz.score = 0;
    currentQuiz.answers = [];
    currentQuiz.selectedAnswer = null;
    currentQuiz.startTime = Date.now();
    // Set time per question based on difficulty level
    currentQuiz.timePerQuestion = DIFFICULTY_TIMINGS[difficulty];

    // Hide selection, show quiz
    document.getElementById('difficultySelection').classList.add('hidden');
    document.getElementById('quizContainer').classList.remove('hidden');

    loadQuestion();
}

function getRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function loadQuestion() {
    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const totalQuestions = currentQuiz.questions.length;
    const currentIndex = currentQuiz.currentIndex + 1;

    document.getElementById('questionNumber').textContent = `Question ${currentIndex}/${totalQuestions}`;
    document.getElementById('quizProgress').style.width = (currentIndex / totalQuestions) * 100 + '%';
    document.getElementById('questionText').textContent = question.question;

    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';

    question.options.forEach((option, index) => {
        const btn = document.createElement('div');
        btn.className = 'answer-option';
        btn.textContent = option;
        btn.onclick = () => selectAnswer(index, btn);
        answersGrid.appendChild(btn);
    });

    startTimer();
}

function selectAnswer(index, element) {
    currentQuiz.selectedAnswer = index;
    
    // Update UI
    document.querySelectorAll('.answer-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
}

function submitAnswer() {
    if (currentQuiz.selectedAnswer === null) {
        alert('Please select an answer');
        return;
    }

    const question = currentQuiz.questions[currentQuiz.currentIndex];
    const isCorrect = currentQuiz.selectedAnswer === question.correct;

    // Store answer
    currentQuiz.answers.push({
        question: question.question,
        selected: question.options[currentQuiz.selectedAnswer],
        correct: question.options[question.correct],
        isCorrect: isCorrect
    });

    if (isCorrect) {
        currentQuiz.score++;
    }

    // Show feedback
    showFeedback(isCorrect, question);

    // Move to next question or finish
    setTimeout(() => {
        currentQuiz.currentIndex++;
        currentQuiz.selectedAnswer = null;

        if (currentQuiz.currentIndex < currentQuiz.questions.length) {
            document.getElementById('feedbackContainer').classList.add('hidden');
            loadQuestion();
        } else {
            finishQuiz();
        }
    }, 2000);
}

function showFeedback(isCorrect, question) {
    const container = document.getElementById('feedbackContainer');
    const content = document.getElementById('feedbackContent');

    const correctAnswer = question.options[question.correct];
    const message = isCorrect 
        ? `✅ Correct! The answer is ${correctAnswer}`
        : `❌ Incorrect. The correct answer is ${correctAnswer}`;

    content.innerHTML = message;
    container.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    container.classList.remove('hidden');
}

function startTimer() {
    const timerEl = document.getElementById('timer');
    let timeLeft = currentQuiz.timePerQuestion;

    const timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft + 's';

        if (timeLeft <= 0) {
            clearInterval(timer);
            // Auto submit incorrect answer
            currentQuiz.selectedAnswer = -1;
            submitAnswer();
        } else if (timeLeft <= 10) {
            timerEl.style.color = '#EF4444';
        }
    }, 1000);
}

function finishQuiz() {
    const user = getCurrentUser();
    const correct = currentQuiz.score;
    const total = currentQuiz.questions.length;
    const accuracy = (correct / total) * 100;
    const pointsPerQuestion = getPointsForDifficulty(currentQuiz.difficulty);
    const pointsEarned = correct * pointsPerQuestion;

    // Update user stats
    user.stats.totalQuestions += total;
    user.stats.correctAnswers += correct;
    user.stats.wrongAnswers += (total - correct);
    user.stats.totalPoints += pointsEarned;
    user.stats.accuracy = ((user.stats.correctAnswers / user.stats.totalQuestions) * 100) || 0;
    
    if (correct === total) {
        user.stats.currentStreak++;
    } else {
        user.stats.currentStreak = 0;
    }

    // Check for streak bonus
    let bonusPoints = 0;
    if (user.stats.currentStreak >= 3) {
        bonusPoints = Math.floor(user.stats.currentStreak * 10);
        user.stats.totalPoints += bonusPoints;
    }

    // Update level and XP
    const xpGained = pointsEarned + bonusPoints;
    const oldLevel = user.stats.level;
    updateXPAndLevel(user, xpGained);
    
    // Check achievements
    checkAndUnlockAchievements(user);

    // Check daily challenge
    const today = new Date().toDateString();
    if (user.dailyChallengeDate !== today) {
        user.dailyChallengeDate = today;
        user.stats.totalPoints += 50; // Daily bonus
    }

    // Save user
    saveUser(localStorage.getItem('mathmastery_current_user'), user);

    // Show results
    showResults(correct, total, accuracy, pointsEarned, bonusPoints, user.stats.level > oldLevel);
}

function updateXPAndLevel(user, xpGained) {
    user.stats.xp += xpGained;
    
    while (true) {
        const xpForNextLevel = 100 * Math.pow(1.5, user.stats.level);
        if (user.stats.xp >= xpForNextLevel) {
            user.stats.level++;
            user.stats.xp -= xpForNextLevel;
            triggerLevelUpAnimation();
        } else {
            break;
        }
    }
}

function getPointsForDifficulty(difficulty) {
    const points = { easy: 10, medium: 20, hard: 40, expert: 70, master: 100 };
    return points[difficulty];
}

function showResults(correct, total, accuracy, points, bonus, levelUp) {
    document.getElementById('quizContainer').classList.add('hidden');
    document.getElementById('resultsContainer').classList.remove('hidden');

    document.getElementById('finalScore').textContent = correct + ' / ' + total;
    document.getElementById('finalCorrect').textContent = correct;
    document.getElementById('finalAccuracy').textContent = Math.round(accuracy) + '%';
    document.getElementById('earnedPoints').textContent = points;

    if (bonus > 0) {
        document.getElementById('bonusSection').style.display = 'block';
        document.getElementById('bonusText').textContent = `Streak bonus: +${bonus} points`;
    }

    if (levelUp) {
        triggerConfetti();
    }
}

function retakeQuiz() {
    document.getElementById('resultsContainer').classList.add('hidden');
    document.getElementById('difficultySelection').classList.remove('hidden');
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function quitQuiz() {
    if (confirm('Are you sure you want to quit? Your progress will not be saved.')) {
        window.location.href = 'dashboard.html';
    }
}

function startQuiz(difficulty) {
    window.location.href = `quiz.html?difficulty=${difficulty}`;
}

// ============================================================
// PROFILE PAGE
// ============================================================

function loadProfilePage() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load profile info
    document.getElementById('profileAvatar') && (document.getElementById('profileAvatar').textContent = user.avatar);
    document.getElementById('profileName') && (document.getElementById('profileName').value = user.fullName);
    document.getElementById('profileUsername') && (document.getElementById('profileUsername').value = user.username);
    document.getElementById('profileEmail') && (document.getElementById('profileEmail').value = user.email);

    // Load stats
    document.getElementById('statTotalQuestions') && (document.getElementById('statTotalQuestions').textContent = user.stats.totalQuestions);
    document.getElementById('statCorrectAnswers') && (document.getElementById('statCorrectAnswers').textContent = user.stats.correctAnswers);
    document.getElementById('statWrongAnswers') && (document.getElementById('statWrongAnswers').textContent = user.stats.wrongAnswers);
    document.getElementById('statAccuracy') && (document.getElementById('statAccuracy').textContent = Math.round(user.stats.accuracy) + '%');
    document.getElementById('statHighestScore') && (document.getElementById('statHighestScore').textContent = user.stats.highestScore);
    document.getElementById('statLevel') && (document.getElementById('statLevel').textContent = user.stats.level);
    document.getElementById('statTotalPoints') && (document.getElementById('statTotalPoints').textContent = user.stats.totalPoints);

    // Load achievements
    loadAchievements();

    // Setup form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Setup delete account
    const deleteBtn = document.getElementById('deleteAccountBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', showDeleteConfirmation);
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const user = getCurrentUser();
    const newName = document.getElementById('profileName').value;
    const newUsername = document.getElementById('profileUsername').value;

    user.fullName = newName;
    user.username = newUsername;

    // Handle password change if requested
    if (document.getElementById('changePasswordCheckbox').checked) {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;

        if (atob(user.password) !== currentPassword) {
            alert('Current password is incorrect');
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            alert('New password must be at least 8 characters');
            return;
        }

        user.password = btoa(newPassword);
    }

    saveUser(localStorage.getItem('mathmastery_current_user'), user);
    alert('Profile updated successfully!');
    loadProfilePage();
}

function handleAvatarUpload(e) {
    // For demo, just cycle through avatars
    const avatars = ['👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🔬', '👩‍🔬', '🧑‍🏫'];
    const user = getCurrentUser();
    const currentIndex = avatars.indexOf(user.avatar);
    const newIndex = (currentIndex + 1) % avatars.length;
    user.avatar = avatars[newIndex];
    
    saveUser(localStorage.getItem('mathmastery_current_user'), user);
    document.getElementById('profileAvatar').textContent = user.avatar;
}

function togglePasswordChange() {
    const section = document.getElementById('passwordChangeSection');
    const checkbox = document.getElementById('changePasswordCheckbox');
    
    if (checkbox.checked) {
        section.classList.remove('hidden');
    } else {
        section.classList.add('hidden');
    }
}

function showDeleteConfirmation() {
    const modal = document.getElementById('confirmModal');
    const message = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    message.textContent = 'Are you sure you want to delete your account? This action cannot be undone.';
    modal.classList.remove('hidden');

    confirmBtn.onclick = () => {
        deleteAccount();
    };
}

function deleteAccount() {
    const email = localStorage.getItem('mathmastery_current_user');
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    
    delete users[email];
    localStorage.setItem('mathmastery_users', JSON.stringify(users));
    localStorage.removeItem('mathmastery_current_user');
    
    alert('Account deleted successfully');
    window.location.href = 'index.html';
}

function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
}

// ============================================================
// LEADERBOARD
// ============================================================

function loadLeaderboard() {
    const users = JSON.parse(localStorage.getItem('mathmastery_users')) || {};
    const currentUser = getCurrentUser();
    
    const leaderboardData = Object.keys(users)
        .map(email => ({
            email,
            ...users[email]
        }))
        .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints);

    const tbody = document.getElementById('leaderboardBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    leaderboardData.forEach((user, index) => {
        const row = document.createElement('tr');
        if (currentUser && currentUser.email === user.email) {
            row.classList.add('current-user');
        }

        const rankBadge = index < 3 
            ? `<span class="rank-badge ${['gold', 'silver', 'bronze'][index]}">${index + 1}</span>`
            : `<span class="rank-badge">${index + 1}</span>`;

        row.innerHTML = `
            <td>${rankBadge}</td>
            <td>${user.username}</td>
            <td>Level ${user.stats.level}</td>
            <td>${user.stats.totalPoints}</td>
            <td>${user.stats.totalQuestions}</td>
            <td>${Math.round(user.stats.accuracy)}%</td>
        `;
        tbody.appendChild(row);
    });

    // Update current user's rank
    if (currentUser) {
        updateUserRank();
    }
}

// ============================================================
// ANIMATIONS & EFFECTS
// ============================================================

function triggerConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#2563EB', '#10B981', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 4)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        container.appendChild(confetti);

        setTimeout(() => confetti.remove(), 3000);
    }
}

function triggerLevelUpAnimation() {
    showNotification('🎉 Level Up! You\'re on fire!');
    triggerConfetti();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #2563EB, #3B82F6);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInLeft 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================================
// PAGE INITIALIZATION
// ============================================================

function setupEventListeners() {
    if (document.getElementById('contactForm')) {
        document.getElementById('contactForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            e.target.reset();
        });
    }
}

// Load appropriate page content
if (window.location.pathname.includes('dashboard')) {
    loadDashboardData();
} else if (window.location.pathname.includes('profile')) {
    loadProfilePage();
} else if (window.location.pathname.includes('leaderboard')) {
    loadLeaderboard();
}
