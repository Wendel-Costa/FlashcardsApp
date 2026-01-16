import { Container } from "../../components/Container";
import { LoginContainer } from "../../components/LoginContainer";
import { LoginHeader } from "../../components/LoginHeader";
import { MainTemplate } from "../../templates/MainTemplate";

export function Login() {
   return (
      <MainTemplate>
         <LoginHeader />
         <LoginContainer />
      </MainTemplate>
   )
}