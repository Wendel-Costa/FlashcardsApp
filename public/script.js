const URL = 'https://apiflashcards.vercel.app';

async function chamarApi() {
    const resp = await fetch(URL);
    if (resp.status === 200){
        const cards = await resp.json();
        console.log(cards);
    }
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