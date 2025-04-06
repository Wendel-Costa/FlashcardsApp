const API_BASE_URL = '/api';
const URL_CARDS = `${API_BASE_URL}/cards`;
const URL_CRIAR_CARD = `${API_BASE_URL}/cards/gerartexto`;
const URL_REGISTER = `${API_BASE_URL}/users/register`;
const URL_LOGIN = `${API_BASE_URL}/users/login`;

const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const showRegisterFormLink = document.getElementById('show-register-form');
const showLoginFormLink = document.getElementById('show-login-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');
const mainContent = document.querySelector('.main');
const logoutButton = document.getElementById('logout-button');
const mainOutput = document.querySelector('.main_output');
const generateCardButton = document.getElementById('botaoGerarCard');
const startAnkiStudyButton = document.getElementById('start-anki-study');
const ankiStudySection = document.querySelector('.anki-study');
const ankiQuestion = document.querySelector('.anki-card-question');
const showAnswerButton = document.getElementById('show-answer-btn');
const ankiAnswer = document.querySelector('.anki-card-answer');
const wrongButton = document.querySelector('.wrong-btn');
const correctButton = document.querySelector('.correct-btn');
const nextCardButton = document.getElementById('next-card-btn');
const ankiMessage = document.getElementById('anki-message');
const backToCreateButton = document.getElementById('back-to-create-btn');

let authToken = localStorage.getItem('authToken');
let currentCardIndex = 0;
let studyCards = [];
let flashcards = [];

function updateAuthUI() {
    const loginSection = document.querySelector('.login');
    if (authToken) {
        loginSection.style.display = 'none';
        registerContainer.style.display = 'none';
        mainContent.style.display = 'block';
        logoutButton.style.display = 'block';
    } else {
        loginSection.style.display = 'flex';
        registerContainer.style.display = 'none';
        mainContent.style.display = 'none';
        logoutButton.style.display = 'none';
    }
}

async function registerUser(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('register-username');
    const passwordInput = document.getElementById('register-password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    registerMessage.textContent = 'Registrando...';
    registerMessage.className = 'message';

    try {
        const response = await fetch(URL_REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: username, senha: password })
        });

        const data = await response.json();

        if (response.status === 201) {
            registerMessage.textContent = data.message;
            registerMessage.className = 'message success';
            loginContainer.style.display = 'block';
            registerContainer.style.display = 'none';
        } else {
            registerMessage.textContent = data.message;
            registerMessage.className = 'message error';
        }
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        registerMessage.textContent = 'Erro ao registrar usuário. Tente novamente.';
        registerMessage.className = 'message error';
    }
}

async function loginUser(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const username = usernameInput.value;
    const password = passwordInput.value;

    loginMessage.textContent = 'Entrando...';
    loginMessage.className = 'message';

    try {
        const response = await fetch(URL_LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome: username, senha: password })
        });

        const data = await response.json();

        if (response.status === 200) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            loginMessage.textContent = data.message;
            loginMessage.className = 'message success';
            updateAuthUI();
            chamarApi();
        } else {
            loginMessage.textContent = data.message;
            loginMessage.className = 'message error';
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        loginMessage.textContent = 'Erro ao fazer login. Tente novamente.';
        loginMessage.className = 'message error';
    }
}

function logout() {
    localStorage.removeItem('authToken');
    authToken = null;
    updateAuthUI();
    mainOutput.innerHTML = '';
    ankiStudySection.style.display = 'none';
}

async function chamarApi() {
    if (!authToken) {
        mainOutput.innerHTML = '<p class="error">Você precisa estar logado para ver seus flashcards.</p>';
        return;
    }

    mainOutput.innerHTML = '<p class="loading">Carregando seus flashcards...</p>';

    try {
        const resp = await fetch(URL_CARDS, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (resp.status === 200) {
            flashcards = await resp.json();
            console.log(flashcards);
            exibirFlashcards(flashcards);
        } else if (resp.status === 401) {
            mainOutput.innerHTML = '<p class="error">Sua sessão expirou. Por favor, faça login novamente.</p>';
            logout();
        } else {
            const errorData = await resp.json();
            mainOutput.innerHTML = `<p class="error">Erro ao carregar flashcards: ${errorData.message || 'Erro desconhecido'}</p>`;
        }
    } catch (error) {
        console.error('Erro ao chamar a API de cards:', error);
        mainOutput.innerHTML = '<p class="error">Erro ao carregar flashcards. Tente novamente.</p>';
    }
}

function exibirFlashcards(cards) {
    const outputSection = document.querySelector('.main_output');
    outputSection.innerHTML = '';

    if (cards && cards.length > 0) {
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('flashcard');
            cardElement.innerHTML = `
                <h3>${card.pergunta}</h3>
                <p><strong>Resposta:</strong> ${card.resposta}</p>
                <p><strong>Tag:</strong> ${card.tag}</p>
            `;
            outputSection.appendChild(cardElement);
        });
    } else {
        outputSection.innerHTML = '<p>Nenhum flashcard encontrado. Crie o seu primeiro!</p>';
    }
}

async function gerarFlashcardIA() {
    if (!authToken) {
        alert('Você precisa estar logado para gerar flashcards.');
        return;
    }

    const detalhe = document.querySelector('input[name="nivelDetalhe"]:checked').value;
    const pergunta = document.querySelector('#pergunta').value;
    const tag = document.querySelector('#tag').value;
    const tom = document.querySelector('#tom').value;

    if (!pergunta || !tag) { // Removi a validação de 'topico'
        alert('Preencha todos os campos!');
        return;
    }

    const dados = {
        detalhe,
        pergunta,
        tag,
        tom
    };

    mainOutput.innerHTML = '<p class="loading">Gerando flashcard...</p>';

    try {
        const resp = await fetch(URL_CRIAR_CARD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(dados)
        });

        if (resp.status === 201) {
            const resposta = await resp.json();
            exibirCard(resposta.card);
        } else if (resp.status === 401) {
            mainOutput.innerHTML = '<p class="error">Sua sessão expirou. Por favor, faça login novamente.</p>';
            logout();
        } else {
            const erro = await resp.json();
            mainOutput.innerHTML = `<p class="error">Erro ao criar o flashcard: ${erro.message || 'Erro desconhecido'}</p>`;
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
        mainOutput.innerHTML = '<p class="error">Erro ao criar o flashcard. Tente novamente.</p>';
    }
}

function exibirCard(card) {
    const mainOutput = document.querySelector('.main_output');
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashcard');
    cardElement.innerHTML = `
        <h3>${card.pergunta}</h3>
        <p><strong>Resposta:</strong> ${card.resposta}</p>
        <p><strong>Tag:</strong> ${card.tag}</p>
    `;
    mainOutput.prepend(cardElement);
    if (mainOutput.querySelector('.loading')) {
        mainOutput.removeChild(mainOutput.querySelector('.loading'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    if (authToken) {
        chamarApi();
    }
});

showRegisterFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.style.display = 'none';
    registerContainer.style.display = 'block';
});

showLoginFormLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.style.display = 'none';
    loginContainer.style.display = 'block';
});

loginForm.addEventListener('submit', loginUser);
registerForm.addEventListener('submit', registerUser);
logoutButton.addEventListener('click', logout);
generateCardButton.addEventListener('click', gerarFlashcardIA);

// Lógica para a seção de estudo Anki
startAnkiStudyButton.addEventListener('click', () => {
    if (flashcards && flashcards.length > 0) {
        studyCards = [...flashcards];
        currentCardIndex = 0;
        ankiStudySection.style.display = 'block';
        mainOutput.style.display = 'none';
        logoutButton.style.display = 'none';
        document.querySelector('.main_input').style.display = 'none';
        showCard();
    } else {
        ankiMessage.textContent = 'Nenhum flashcard encontrado para estudar.';
    }
});

function showCard() {
    if (currentCardIndex < studyCards.length) {
        const card = studyCards[currentCardIndex];
        ankiQuestion.textContent = card.pergunta;
        ankiAnswer.style.display = 'none';
        showAnswerButton.style.display = 'block';
        wrongButton.style.display = 'none';
        correctButton.style.display = 'none';
        nextCardButton.style.display = 'none';
        ankiMessage.textContent = '';
    } else {
        ankiMessage.textContent = 'Você revisou todos os flashcards!';
        ankiQuestion.textContent = '';
        ankiAnswer.style.display = 'none';
        showAnswerButton.style.display = 'none';
        nextCardButton.style.display = 'none';
    }
}

showAnswerButton.addEventListener('click', () => {
    const card = studyCards[currentCardIndex];
    ankiAnswer.querySelector('.anki-buttons').style.display = 'flex';
    ankiAnswer.querySelector('div:first-child').textContent = card.resposta;
    ankiAnswer.style.display = 'block';
    showAnswerButton.style.display = 'none';
    wrongButton.style.display = 'inline-block';
    correctButton.style.display = 'inline-block';
    nextCardButton.style.display = 'block';
});

nextCardButton.addEventListener('click', () => {
    currentCardIndex++;
    showCard();
});

wrongButton.addEventListener('click', () => {
    currentCardIndex++;
    showCard();
});

correctButton.addEventListener('click', () => {
    currentCardIndex++;
    showCard();
});

backToCreateButton.addEventListener('click', () => {
    ankiStudySection.style.display = 'none';
    document.querySelector('.main_input').style.display = 'block';
    mainOutput.style.display = 'block';
    logoutButton.style.display = 'block';
});