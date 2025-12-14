import { Container } from "../../components/Container";
import { HomeHeader } from "../../components/HomeHeader";
import { MainTemplate } from "../../templates/MainTemplate";

export function Home() {
   return (
      <MainTemplate>
         <HomeHeader />

         <Container>Teste</Container>
      </MainTemplate>
   )
}