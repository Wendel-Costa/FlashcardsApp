import { LoginContainer } from "../../components/LoginContainer";
import { LoginForm } from "../../components/LoginForm";
import { LoginHeader } from "../../components/LoginHeader";
import { MainTemplate } from "../../templates/MainTemplate";

export function Login() {
   return (
      <MainTemplate>
         <LoginHeader />
         <LoginContainer>
            <LoginForm />
         </LoginContainer>
      </MainTemplate>
   )
}