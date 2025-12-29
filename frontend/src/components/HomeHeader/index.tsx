import { LogOut, Plus, Sparkles } from 'lucide-react'
import { DefaultHeader } from '../DefaultHeader'
import styles from './styles.module.css'

export function HomeHeader() {
   return (
      <DefaultHeader>
         <div className={styles.homeHeader}>
            <a href="" className={styles.buttonCard}>
               <Plus />
               <div>Criar Card</div>
            </a>

            <a href="" className={styles.buttonCardAI}>
               <Sparkles />
               <div>Criar Card Com IA</div>
            </a>

            <a href="" className={styles.buttonOut}>
               <LogOut />
               <div>Sair</div>
            </a>
         </div>
      </DefaultHeader>
   )
}