import { CardAnswer } from "../../components/CardAnswer";
import { CardQuestion } from "../../components/CardQuestion";
import { CardViewHeader } from "../../components/CardViewHeader";
import { OptionsAnswers } from "../../components/OptionsAnswers";
import { MainTemplate } from "../../templates/MainTemplate";

export function CardView() {
   return (
      <MainTemplate>
         <CardViewHeader deckName="Matemática" />
         <CardQuestion>Pergunta</CardQuestion>
         <CardAnswer>Resposta</CardAnswer>
         <OptionsAnswers daysWhenWrong={2} daysWhenCorrect={10} daysWhenHard={1} />
      </MainTemplate>
   )
}