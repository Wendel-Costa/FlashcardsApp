const URL = 'https://apiflashcards.vercel.app/cards';

const mainOutput = document.querySelector('.main_output');

async function chamarApi() {
    mainOutput.innerHTML = '<p class="loading">Carregando...</p>';

    const resp = await fetch(URL);
    let cards;
    if (resp.status === 200){
        cards = await resp.json();
        console.log(cards);
        exibirFlashcards(cards);
    }

}

function exibirFlashcards(cards) {
    const outputSection = document.querySelector('.main_output');
    outputSection.innerHTML = '';

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
}

window.addEventListener('DOMContentLoaded', () => chamarApi());

async function gerarFlashcardIA() {
    const topico = document.querySelector('#topico').value;

    const detalhe = document.querySelector('input[name="nivelDetalhe"]:checked').value;

    const pergunta = document.querySelector('#pergunta').value;

    const tag = document.querySelector('#tag').value;

    const dono = '67017e8854838b0101646790';

    if (!topico || !detalhe || !pergunta || !tag) {
        alert('Preencha todos os campos!');
        return;
    }

    const dados = {
        topico,
        detalhe,
        pergunta,
        tag,
        dono
    };

    const mainOutput = document.querySelector('.main_output');
    mainOutput.innerHTML = '<p class="loading">Carregando...</p>';

    try {
        const resp = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (resp.status === 201) {
            const resposta = await resp.json();
            exibirCard(resposta.card); 
        } else {
            const erro = await resp.json();
            mainOutput.innerHTML = `<p class="error">${erro.message}</p>`;
        }
    } catch (error) {
        console.error('Erro ao enviar dados para o backend:', error);
        mainOutput.innerHTML = '<p class="error">Erro ao criar o flashcard. Tente novamente.</p>';
    }
}

document.querySelector('#botaoGerarCard').addEventListener('click', gerarFlashcardIA);

/*document.querySelector('#botaoGerarCard').addEventListener('click', () => chamarApi());

function gerarFlashcards(){
    const topico = document.querySelector("#topico").value;
    const detalhe = document.querySelector('input[name="nivelDetalhe"]:checked').value;

    console.log(topico);
    console.log(detalhe);
    //gerarTexto(topico);
    alert("Ok");
}*/