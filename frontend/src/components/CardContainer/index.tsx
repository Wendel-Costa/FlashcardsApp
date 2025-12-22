import styles from './styles.module.css'

type CardContainerProps = {
   children: React.ReactNode
}

export function CardContainer({ children }: CardContainerProps) {
   return (
      <div className={styles.block}>
         {children}
      </div>
   )
}