import { Container } from "../../components/Container";
import { DeckBlock } from "../../components/DeckBlock";
import { DeckBlocksSection } from "../../components/DeckBlocksSection";
import { HomeHeader } from "../../components/HomeHeader";
import { HomeTitle } from "../../components/HomeTitle";
import { MainTemplate } from "../../templates/MainTemplate";

export function Home() {
   return (
      <MainTemplate>
         <HomeHeader />

         <HomeTitle userName={'wendel'} />

         <DeckBlocksSection>
            <DeckBlock deckName={'Matemática'} />
         </DeckBlocksSection>

         <Container>Teste</Container>
      </MainTemplate>
   )
}