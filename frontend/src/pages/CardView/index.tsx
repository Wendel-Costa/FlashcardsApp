import { CardAnswer } from "../../components/CardAnswer";
import { CardQuestion } from "../../components/CardQuestion";
import { MainTemplate } from "../../templates/MainTemplate";

export function CardView() {
   return (
      <MainTemplate>
         <CardQuestion>Pergunta</CardQuestion>
         <CardAnswer>Resposta</CardAnswer>

      </MainTemplate>
   )
}