import styles from './styles.module.css'

type ShowAnswerProps = {
   setIsAnswerVisible: (arg: boolean) => void;
}

export function ShowAnswer({ setIsAnswerVisible }: ShowAnswerProps) {
   return (
      <div className={styles.block}>
         <button onClick={() => setIsAnswerVisible(true)}>Mostrar Resposta</button>
      </div>
   )
}