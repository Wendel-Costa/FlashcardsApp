import { DefaultHeader } from '../DefaultHeader'
import styles from './styles.module.css'

export function HomeHeader() {
   return (
      <DefaultHeader>
         <div className={styles.homeHeader}>
            <a href="">Criar Card</a>
            <a href="">Criar Card Com IA</a>
            <a href="">Sair</a>
         </div>
      </DefaultHeader>
   )
}