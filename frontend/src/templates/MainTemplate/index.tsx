import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"

type MainTemplateProps = {
   children: React.ReactNode
}

export function MainTemplate({ children }: MainTemplateProps) {
   return (
      <>
         {children}

         <Container>
            <Footer />
         </Container>
      </>
   )
}