import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"
import { Header } from "../../components/Header"

type MainTemplateProps = {
   children: React.ReactNode
}

export function MainTemplate({ children }: MainTemplateProps) {
   return (
      <>
         <Container>
            <Header />
         </Container>

         <Container>
            {children}
         </Container>

         <Container>
            <Footer />
         </Container>
      </>
   )
}