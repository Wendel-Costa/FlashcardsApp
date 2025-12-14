import { LogOut, Plus, Sparkles } from 'lucide-react'
import { DefaultHeader } from '../DefaultHeader'
import styles from './styles.module.css'

export function HomeHeader() {
   return (
      <DefaultHeader>
         <div className={styles.homeHeader}>
            <a href="" className={styles.buttonCard}>
               <Plus />
               <p>Criar Card</p>
            </a>

            <a href="" className={styles.buttonCardAI}>
               <Sparkles />
               <p>Criar Card Com IA</p>
            </a>

            <a href="" className={styles.buttonOut}>
               <LogOut />
               <p>Sair</p>
            </a>
         </div>
      </DefaultHeader>
   )
}