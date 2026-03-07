import { RegisterContainer } from '../../components/RegisterContainer';
import { LoginHeader } from '../../components/LoginHeader';
import { RegisterForm } from '../../components/RegisterForm';
import { MainTemplate } from '../../templates/MainTemplate';

export function Register() {
   return (
      <MainTemplate>
         <LoginHeader />
         <RegisterContainer>
            <RegisterForm />
         </RegisterContainer>
      </MainTemplate>
   );
}