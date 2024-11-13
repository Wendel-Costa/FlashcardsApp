import gerarTexto from "../src/api/geminiApp.js";

document.querySelector('#botaoGerarCard').addEventListener('click', () => gerarFlashcards());

function gerarFlashcards(){
    const topico = document.querySelector("#topico").value;
    const detalhe = document.querySelector('input[name="nivelDetalhe"]:checked').value;

    console.log(topico);
    console.log(detalhe);
    gerarTexto(topico);
    alert("Ok");
}