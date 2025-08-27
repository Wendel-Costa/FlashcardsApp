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
const cardListView = document.getElementById('card-list-view');

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
const deckListMessage = document.getElementById('deck-list-message');

// Card List View
const cardListContainer = document.getElementById('card-list-container');
const cardListTitle = document.getElementById('card-list-title');
const backToDecksBtn = document.getElementById('back-to-decks-btn');
const studyThisDeckBtn = document.getElementById('study-this-deck-btn');


// Add Card View
const tabButtons = document.querySelectorAll('.tab-nav__button');
const tabContents = document.querySelectorAll('.tab-content');
const manualCardForm = document.getElementById('manual-card-form');
const iaSingleForm = document.getElementById('ia-single-form');
const iaBulkForm = document.getElementById('ia-bulk-form');
const cancelAddButtons = document.querySelectorAll('.cancel-add-btn');
const generationMessage = document.getElementById('generation-message');
const existingTagsDatalist = document.getElementById('existing-tags');

// Study View
const studyCardFront = document.getElementById('study-card-front');
const studyCardBack = document.getElementById('study-card-back');
const cardQuestionContent = document.getElementById('card-question-content');
const cardAnswerContent = document.getElementById('card-answer-content');
const showAnswerBtn = document.getElementById('show-answer-btn');
const gradeButtons = document.getElementById('grade-buttons');
const studyMessage = document.getElementById('study-message');
const stopStudyBtn = document.getElementById('stop-study-btn');

// Edit Modal
const editModal = document.getElementById('edit-modal');
const editCardForm = document.getElementById('edit-card-form');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

/* */


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

    if (!response.ok) {
        if (response.status === 401 && !endpoint.includes('/login')) {
            handleLogout();
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ocorreu um erro na API.');
    }

    return response.json();
}


// VIEW

function showView(viewToShow) {
    [authView, appView].forEach(view => view.classList.remove('view--active'));
    viewToShow.classList.add('view--active');
}

function showMainView(viewToShow) {
    [deckListView, addCardView, studyView, cardListView].forEach(view => view.classList.remove('main-view--active'));
    viewToShow.classList.add('main-view--active');
}

//AUTHENTICATION 

async function handleLogin(event) {
    event.preventDefault();
    const usernameInput = loginForm.querySelector('#login-username');
    const passwordInput = loginForm.querySelector('#login-password');
    loginMessage.textContent = '';
    loginMessage.className = 'message';

    try {
        const data = await apiFetch('/users/login', {
            method: 'POST',
            body: { username: usernameInput.value, password: passwordInput.value }
        });
        
        state.authToken = data.token;
        state.username = usernameInput.value;
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('username', usernameInput.value);

        await initializeApp();

    } catch (error) {
        loginMessage.textContent = error.message;
        loginMessage.className = 'message message--error';
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const usernameInput = registerForm.querySelector('#register-username');
    const passwordInput = registerForm.querySelector('#register-password');
    registerMessage.textContent = '';
    registerMessage.className = 'message';

    try {
        const data = await apiFetch('/users/register', {
            method: 'POST',
            body: { username: usernameInput.value, password: passwordInput.value }
        });
        
        registerMessage.textContent = data.message + " Por favor, faça o login.";
        registerForm.reset();
        
        registerContainer.style.display = 'none';
        loginContainer.style.display = 'block';

    } catch (error) {
        registerMessage.textContent = error.message;
        registerMessage.className = 'message message--error';
    }
}

function handleLogout() {
    state.authToken = null;
    state.username = '';
    state.isGuest = false;
    localStorage.clear();
    
    guestBanner.style.display = 'none';
    showView(authView);
    deckListContainer.innerHTML = ''; 
}

// Modo visitante

function handleGuestMode(e) {
    e.preventDefault();
    state.isGuest = true;
    state.username = 'Visitante';
    guestBanner.style.display = 'block';
    
    initializeApp();

    state.allCards = [
        { _id: 'g1', question: 'O que é HTML?', answer: 'É uma linguagem de marcação para criar páginas web.', tag: 'Tecnologia', status: 'new', nextReviewDate: new Date() },
        { _id: 'g2', question: 'Qual a capital do Brasil?', answer: 'Brasília.', tag: 'Geografia', status: 'new', nextReviewDate: new Date() }
    ];
    renderDecks(state.allCards);
    populateTagDatalist();
}

// Carregar e Renderizar Baralhos e Cards

function populateTagDatalist() {
    const tags = new Set(state.allCards.map(card => card.tag).filter(Boolean));
    existingTagsDatalist.innerHTML = '';
    tags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        existingTagsDatalist.appendChild(option);
    });
}

async function fetchAndRenderDecks() {
    if(state.isGuest) return;

    try {
        state.allCards = await apiFetch('/cards');
        renderDecks(state.allCards);
        populateTagDatalist();
    } catch (error) {
        console.error("Failed to fetch decks:", error);
        deckListContainer.innerHTML = `<p>Erro ao carregar baralhos.</p>`;
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
        <div class="deck-list__item" data-tag="${tagName}">
            <h3 class="deck-list__item-title">${tagName}</h3>
            <div class="deck-list__item-stats">
                <span>Total: ${counts.total}</span>
                <span>Novos: ${counts.new}</span>
                <span>Revisar: ${counts.review}</span>
            </div>
        </div>
    `).join('');
}

function renderCardList(tagName) {
    cardListTitle.textContent = tagName;
    const cardsInDeck = state.allCards.filter(card => (card.tag || 'Sem Categoria') === tagName);

    if (cardsInDeck.length === 0) {
        cardListContainer.innerHTML = "<p>Nenhum card neste baralho.</p>";
        return;
    }

    cardListContainer.innerHTML = cardsInDeck.map(card => `
        <div class="card-list-item">
            <div class="card-list-item__content">${marked.parse(card.question)}</div>
            <div class="card-list-item__content">${marked.parse(card.answer)}</div>
            <div class="card-list-item__actions">
                <button class="btn btn--secondary edit-card-btn" data-card-id="${card._id}">Editar</button>
                <button class="btn btn--danger delete-card-btn" data-card-id="${card._id}">Apagar</button>
            </div>
        </div>
    `).join('');
}


// --- CRIAÇÃO DE CARDS ---

function showTemporaryMessage(message, isError = false) {
    generationMessage.textContent = message;
    generationMessage.className = isError ? 'message message--error' : 'message';
    setTimeout(() => {
        generationMessage.textContent = '';
        generationMessage.className = 'message';
    }, 5000);
}

async function handleManualCardSubmit(event) {
    event.preventDefault();
    const question = manualCardForm.querySelector('#manual-question').value;
    const answer = manualCardForm.querySelector('#manual-answer').value;
    const tag = manualCardForm.querySelector('#manual-tag').value;
    const button = manualCardForm.querySelector('button[type="submit"]');

    if (state.isGuest) {
        const newCard = { _id: `g${Date.now()}`, question, answer, tag, status: 'new', nextReviewDate: new Date() };
        state.allCards.push(newCard);
        renderDecks(state.allCards);
        populateTagDatalist();
        showMainView(deckListView);
        return;
    }

    try {
        button.textContent = 'Salvando...';
        button.disabled = true;
        await apiFetch('/cards', {
            method: 'POST',
            body: { question, answer, tag }
        });
        manualCardForm.reset();
        await fetchAndRenderDecks();
        showMainView(deckListView);
    } catch (error) {
        showTemporaryMessage(error.message, true);
    } finally {
        button.textContent = 'Salvar Card';
        button.disabled = false;
    }
}

async function startStudySession(deckTag = null) {
    let cardsToReview;

    if (state.isGuest) {
        cardsToReview = deckTag ? state.allCards.filter(c => c.tag === deckTag) : state.allCards;
    } else {
        if (deckTag) {
            cardsToReview = state.allCards.filter(c => c.tag === deckTag && new Date(c.nextReviewDate) <= new Date());
        } else {
            cardsToReview = await apiFetch('/cards/review-queue');
        }
    }

    state.studyQueue = cardsToReview;
    state.currentStudyCardIndex = 0;
    
    if (state.studyQueue.length === 0) {
        studyMessage.textContent = deckTag ? "Nenhum card para revisar neste baralho hoje." : "Você revisou tudo por hoje!";
        setTimeout(() => studyMessage.textContent = '', 5000);
        return;
    }

    showMainView(studyView);
    renderCurrentStudyCard();
}

function renderCurrentStudyCard() {
    if (state.currentStudyCardIndex >= state.studyQueue.length) {
        studyMessage.textContent = "Sessão de estudos concluída!";
        setTimeout(() => {
            studyMessage.textContent = '';
            showMainView(deckListView);
        }, 3000);
        return;
    }

    const card = state.studyQueue[state.currentStudyCardIndex];
    cardQuestionContent.innerHTML = marked.parse(card.question);
    cardAnswerContent.innerHTML = marked.parse(card.answer);

    studyCardBack.style.display = 'none';
    gradeButtons.style.display = 'none';
    showAnswerBtn.style.display = 'block';
}

function handleShowAnswer() {
    studyCardBack.style.display = 'block';
    gradeButtons.style.display = 'flex';
    showAnswerBtn.style.display = 'none';
}

async function handleGradeCard(quality) {
    const card = state.studyQueue[state.currentStudyCardIndex];

    if (!state.isGuest) {
        try {
            await apiFetch(`/cards/${card._id}/review`, {
                method: 'POST',
                body: { quality }
            });
        } catch (error) {
            console.error("Falha ao salvar a revisão:", error);
        }
    }
    
    state.currentStudyCardIndex++;
    renderCurrentStudyCard();
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

    // Navegação Principal
    addCardBtn.addEventListener('click', () => showMainView(addCardView));
    cancelAddButtons.forEach(btn => btn.addEventListener('click', () => showMainView(deckListView)));
    backToDecksBtn.addEventListener('click', () => showMainView(deckListView));
    startStudyBtn.addEventListener('click', () => startStudySession());
    stopStudyBtn.addEventListener('click', async () => {
        await fetchAndRenderDecks();
        showMainView(deckListView);
    });

    // Navegação por Baralhos
    deckListContainer.addEventListener('click', (event) => {
        const deckItem = event.target.closest('.deck-list__item');
        if (deckItem) {
            const tagName = deckItem.dataset.tag;
            renderCardList(tagName);
            showMainView(cardListView);
        }
    });

    studyThisDeckBtn.addEventListener('click', () => {
        const tagName = cardListTitle.textContent;
        startStudySession(tagName);
    });

    // Abas de Adicionar Card
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('tab-nav__button--active'));
            button.classList.add('tab-nav__button--active');
            
            tabContents.forEach(content => content.classList.remove('tab-content--active'));
            document.getElementById(button.dataset.tab).classList.add('tab-content--active');
        });
    });

    // Submissão de Formulários de Criação
    manualCardForm.addEventListener('submit', handleManualCardSubmit);
    iaSingleForm.addEventListener('submit', handleIaSingleSubmit);
    iaBulkForm.addEventListener('submit', handleIaBulkSubmit);

    // Lógica da Tela de Estudo
    showAnswerBtn.addEventListener('click', handleShowAnswer);
    gradeButtons.addEventListener('click', (event) => {
        if (event.target.dataset.quality) {
            handleGradeCard(parseInt(event.target.dataset.quality));
        }
    });

    // Check inicial
    checkInitialAuthState();
});

async function handleIaSingleSubmit(event) {
    event.preventDefault();
    const question = iaSingleForm.querySelector('#ia-question').value;
    const tag = iaSingleForm.querySelector('#ia-single-tag').value;

    if (state.isGuest) {
        const newCard = { _id: `g${Date.now()}`, question, answer: "Resposta gerada por IA (simulação)", tag, status: 'new', nextReviewDate: new Date() };
        state.allCards.push(newCard);
        renderDecks(state.allCards);
        populateTagDatalist();
        showMainView(deckListView);
        return;
    }
    
    const button = iaSingleForm.querySelector('button[type="submit"]');
    try {
        button.textContent = 'Gerando...';
        button.disabled = true;
        await apiFetch('/cards/generate-text', {
            method: 'POST',
            body: { question, tag, detailLevel: 'medium', tone: 'neutral' }
        });
        iaSingleForm.reset();
        await fetchAndRenderDecks();
        showMainView(deckListView);
    } catch (error) {
        showTemporaryMessage(error.message, true);
    } finally {
        button.textContent = 'Gerar Card';
        button.disabled = false;
    }
}

async function handleIaBulkSubmit(event) {
    event.preventDefault();
    const topic = iaBulkForm.querySelector('#ia-bulk-topic').value;
    const tag = iaBulkForm.querySelector('#ia-bulk-tag').value;
    const count = iaBulkForm.querySelector('#ia-bulk-count').value;

    if (state.isGuest) {
        for (let i = 0; i < count; i++) {
            const newCard = { _id: `g${Date.now() + i}`, question: `${topic} (Card ${i+1})`, answer: "Resposta gerada por IA (simulação)", tag, status: 'new', nextReviewDate: new Date() };
            state.allCards.push(newCard);
        }
        renderDecks(state.allCards);
        populateTagDatalist();
        showMainView(deckListView);
        return;
    }

    const button = iaBulkForm.querySelector('button[type="submit"]');
    try {
        button.textContent = 'Gerando Baralho...';
        button.disabled = true;
        await apiFetch('/cards/generate-deck', {
            method: 'POST',
            body: { topic, tag, count }
        });
        iaBulkForm.reset();
        await fetchAndRenderDecks();
        showMainView(deckListView);
    } catch (error) {
        showTemporaryMessage(error.message, true);
    } finally {
        button.textContent = 'Gerar Baralho';
        button.disabled = false;
    }
}