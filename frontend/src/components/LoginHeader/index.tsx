import styles from './styles.module.css'
import { DefaultHeader } from "../DefaultHeader";
import { Github } from 'lucide-react';

export function LoginHeader() {
   return (
      <DefaultHeader>
         <a href='https://github.com/Wendel-Costa/FlashcardsApp' className={styles.repoLink} target='_blank' rel='noreferrer'>
            <Github size={18} />
            <span>Ver repositório</span>
         </a>
      </DefaultHeader>
   )
}