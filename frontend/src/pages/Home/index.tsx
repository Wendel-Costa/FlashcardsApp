import { Container } from "../../components/Container";
import { DeckBlock } from "../../components/DeckBlock";
import { HomeHeader } from "../../components/HomeHeader";
import { HomeTitle } from "../../components/HomeTitle";
import { MainTemplate } from "../../templates/MainTemplate";

export function Home() {
   return (
      <MainTemplate>
         <HomeHeader />
         <HomeTitle userName={'wendel'} />
         <DeckBlock deckName={'Matemática'} />
         <Container>Teste</Container>
      </MainTemplate>
   )
}