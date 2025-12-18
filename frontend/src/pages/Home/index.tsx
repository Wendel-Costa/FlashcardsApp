import { Container } from "../../components/Container";
import { HomeHeader } from "../../components/HomeHeader";
import { HomeTitle } from "../../components/HomeTitle";
import { MainTemplate } from "../../templates/MainTemplate";

export function Home() {
   return (
      <MainTemplate>
         <HomeHeader />
         <HomeTitle userName={'wendel'} />
         <Container>Teste</Container>
      </MainTemplate>
   )
}