import styles from './styles.module.css'
import { Container } from "../../components/Container"
import { Footer } from "../../components/Footer"

type MainTemplateProps = {
   children: React.ReactNode
}

export function MainTemplate({ children }: MainTemplateProps) {
   return (
      <div className={styles.mainTemplate}>
         <div className={styles.content}>
            {children}
         </div>

         <Container>
            <Footer />
         </Container>
      </div>
   )
}
