const URL = 'https://apiflashcards.vercel.app/cards';

async function chamarApi() {
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
    outputSection.innerHTML = ''; // Limpa o conteúdo anterior

    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('flashcard'); // Adicione uma classe para estilizar

        cardElement.innerHTML = `
            <h3>${card.pergunta}</h3>
            <p><strong>Resposta:</strong> ${card.resposta}</p>
            <p><strong>Tag:</strong> ${card.tag}</p>
        `;

        outputSection.appendChild(cardElement);
    });
}

document.querySelector('#botaoGerarCard').addEventListener('click', () => chamarApi());
/*
function gerarFlashcards(){
    const topico = document.querySelector("#topico").value;
    const detalhe = document.querySelector('input[name="nivelDetalhe"]:checked').value;

    console.log(topico);
    console.log(detalhe);
    //gerarTexto(topico);
    alert("Ok");
}*/