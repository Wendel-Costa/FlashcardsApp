import styles from './styles.module.css'
import { DefaultHeader } from "../DefaultHeader";

export function LoginHeader() {
   return (
      <DefaultHeader>
         <a href='https://github.com/Wendel-Costa/FlashcardsApp' className={styles.text} target='__blank'>Acesse o repositório</a>
      </DefaultHeader>
   )
}