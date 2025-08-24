//  constantes

const API_BASE_URL = '/api'; 
let state = {
    authToken: null,
    isGuest: false,
    allCards: [],
    studyQueue: [],
    currentStudyCardIndex: 0,
    username: ''
};

/* ELEMENTOS DO DOM */

// Views
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const deckListView = document.getElementById('deck-list-view');
const addCardView = document.getElementById('add-card-view');
const studyView = document.getElementById('study-view');

// Auth
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const showRegisterLink = document.getElementById('show-register-link');
const showLoginLink = document.getElementById('show-login-link');
const guestModeLink = document.getElementById('guest-mode-link');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

// App Shell
const logoutButton = document.getElementById('logout-button');
const usernameDisplay = document.getElementById('username-display');
const guestBanner = document.getElementById('guest-banner');
const guestExitLink = document.getElementById('guest-exit-link');

// Deck List View
const deckListContainer = document.getElementById('deck-list-container');
const addCardBtn = document.getElementById('add-card-btn');
const startStudyBtn = document.getElementById('start-study-btn');

// Add Card View
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const manualCardForm = document.getElementById('manual-card-form');
const iaSingleForm = document.getElementById('ia-single-form');
const iaBulkForm = document.getElementById('ia-bulk-form');
const cancelAddButtons = document.querySelectorAll('.cancel-add-btn');
const generationMessage = document.getElementById('generation-message');

// Study View
const studyCardFront = document.getElementById('study-card-front');
const studyCardBack = document.getElementById('study-card-back');
const cardQuestionContent = document.getElementById('card-question-content');
const cardAnswerContent = document.getElementById('card-answer-content');
const showAnswerBtn = document.getElementById('show-answer-btn');
const gradeButtons = document.getElementById('grade-buttons');
const studyMessage = document.getElementById('study-message');

// Edit Modal
const editModal = document.getElementById('edit-modal');
const editCardForm = document.getElementById('edit-card-form');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

/*      */


// API FETHC 

async function apiFetch(endpoint, options = {}) {
    const { body, ...restOptions } = options;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (state.authToken) {
        headers['Authorization'] = `Bearer ${state.authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers,
        body: body ? JSON.stringify(body) : null,
    });

    if (response.status === 401) {
        handleLogout();
        return;
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An API error occurred.');
    }

    return response.json();
}


// VIEW

function showView(viewToShow) {
    [authView, appView].forEach(view => view.classList.remove('active-view'));
    viewToShow.classList.add('active-view');
}

function showMainView(viewToShow) {
    [deckListView, addCardView, studyView].forEach(view => view.classList.remove('active-view'));
    viewToShow.classList.add('active-view');
}

//AUTHENTICATION 

async function handleLogin(event) {
    event.preventDefault();
    const username = loginForm.querySelector('#login-username').value;
    const password = loginForm.querySelector('#login-password').value;

    try {
        const data = await apiFetch('/users/login', {
            method: 'POST',
            body: { username, password }
        });
        
        state.authToken = data.token;
        state.username = username;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', username);

        await initializeApp();

    } catch (error) {
        loginMessage.textContent = error.message;
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = registerForm.querySelector('#register-username').value;
    const password = registerForm.querySelector('#register-password').value;

    try {
        const data = await apiFetch('/users/register', {
            method: 'POST',
            body: { username, password }
        });
        
        registerMessage.textContent = data.message;
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';

    } catch (error) {
        registerMessage.textContent = error.message;
    }
}

function handleLogout() {
    state.authToken = null;
    state.username = '';
    state.isGuest = false;
    localStorage.clear();
    
    guestBanner.style.display = 'none';
    showView(authView);
}

// Modo visitante

function handleGuestMode() {
    state.isGuest = true;
    guestBanner.style.display = 'block';
    showView(appView);
    renderDecks([
        { _id: 'g1', question: 'O que é HTML?', answer: 'É uma linguagem de marcação para criar páginas web.', tag: 'Tecnologia' },
        { _id: 'g2', question: 'Qual a capital do Brasil?', answer: 'Brasília.', tag: 'Geografia' }
    ]);
}

// Carregar cards

async function fetchAndRenderDecks() {
    if(state.isGuest) return;

    try {
        state.allCards = await apiFetch('/cards');
        renderDecks(state.allCards);
    } catch (error) {
        console.error("Failed to fetch decks:", error);
        deckListContainer.innerHTML = `<p>Error loading decks.</p>`;
    }
}

function renderDecks(cards) {
    if (cards.length === 0) {
        deckListContainer.innerHTML = `<p>Nenhum baralho encontrado. Crie seu primeiro card!</p>`;
        return;
    }

    const decks = cards.reduce((acc, card) => {
        const tag = card.tag || 'Sem Categoria';
        if (!acc[tag]) {
            acc[tag] = { total: 0, new: 0, review: 0 };
        }
        acc[tag].total++;
        if (new Date(card.nextReviewDate) <= new Date()) {
            acc[tag].review++;
        }
        if (card.status === 'new') {
            acc[tag].new++;
        }
        return acc;
    }, {});

    deckListContainer.innerHTML = Object.entries(decks).map(([tagName, counts]) => `
        <div class="deck-item">
            <h3>${tagName}</h3>
            <div class="deck-stats">
                <span>Total: ${counts.total}</span>
                <span>Novos: ${counts.new}</span>
                <span>Revisar: ${counts.review}</span>
            </div>
        </div>
    `).join('');
}


// Inicialização

async function initializeApp() {
    showView(appView);
    usernameDisplay.textContent = state.username;
    await fetchAndRenderDecks();
    showMainView(deckListView);
}

function checkInitialAuthState() {
    const token = localStorage.getItem('authToken');
    const username = localStorage.getItem('username');
    if (token && username) {
        state.authToken = token;
        state.username = username;
        initializeApp();
    } else {
        showView(authView);
    }
}

// --- EVENT LISTENERS ---

document.addEventListener('DOMContentLoaded', () => {
    
    // Auth
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutButton.addEventListener('click', handleLogout);
    guestModeLink.addEventListener('click', handleGuestMode);
    guestExitLink.addEventListener('click', handleLogout);

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });
    
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';
    });

    // Main
    addCardBtn.addEventListener('click', () => showMainView(addCardView));
    
    cancelAddButtons.forEach(btn => {
        btn.addEventListener('click', () => showMainView(deckListView));
    });

    // Add Card
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // Check inicial
    checkInitialAuthState();
});