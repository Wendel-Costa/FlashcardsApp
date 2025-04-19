# Flashcards Inteligentes com Gemini AI

Um aplicativo web para criar e estudar flashcards de forma inteligente, utilizando a IA do Gemini para gerar conteúdo com base nos tópicos fornecidos pelo usuário.
Deploy: https://apiflashcards.vercel.app/

## Funcionalidades Principais

* **Criação Inteligente de Flashcards:** Utilize a IA do Gemini para gerar automaticamente a resposta para seus flashcards com base no tópico e nível de detalhe desejado.
* **Interface Intuitiva:** Uma interface de usuário simples e amigável para criar, visualizar e estudar seus flashcards.
* **Organização por Tags:** Organize seus flashcards utilizando tags para facilitar a busca e o estudo de tópicos específicos.
* **Estudo no Estilo Anki:** Uma seção dedicada ao estudo dos flashcards com a mecânica de "mostrar resposta", "acertei" e "errei", similar ao Anki, para otimizar a memorização.
* **Autenticação de Usuários:** Sistema de login e registro para que cada usuário possa gerenciar seus próprios conjuntos de flashcards.
* **Persistência de Dados:** Os flashcards e informações dos usuários são armazenados de forma segura no MongoDB.

## Tecnologias Utilizadas

* **Frontend:** HTML, CSS, JavaScript (futuramente react)
* **Backend:** Node.js, Express
* **Banco de Dados:** MongoDB, Mongoose
* **Inteligência Artificial:** Gemini API (`@google/generative-ai`)
* **Outros:** dotenv, cors, nodemon

## Como Usar

1.  **Registre-se ou faça login** na página inicial.
2.  Na seção principal, insira a **pergunta** para o seu flashcard.
3.  Adicione uma **tag** para categorizar o card (opcional).
4.  Selecione o **nível de detalhes** desejado para a resposta gerada pela IA.
5.  Clique no botão **"Gerar Flashcards"**. A IA do Gemini irá processar sua pergunta e gerar uma resposta, criando um novo flashcard que será exibido na tela.
6.  Para estudar seus flashcards, clique no botão **"Iniciar Estudo Anki"**. A seção de estudo será exibida, mostrando as perguntas dos seus cards. Clique em "Mostrar Resposta" para ver a resposta e utilize os botões "Errei" e "Acertei" para avançar.
7.  Você pode voltar para a criação de novos cards clicando em "Voltar para Criar".
8.  Para sair da sua conta, clique no botão "Sair".

## Melhorias Futuras

* Implementação de diferentes tipos de flashcards (múltipla escolha, completar lacunas, etc.).
* Opção para editar flashcards existentes.
* Funcionalidade de busca e filtragem de flashcards por tags.
* Integração com outras APIs de IA para diferentes funcionalidades.
* Personalização da interface do estudo Anki.
* Estatísticas de estudo para acompanhar o progresso do usuário.
