import styles from './styles.module.css'


type DeckBlocksSectionProps = {
   children: React.ReactNode
}

export function DeckBlocksSection({ children }: DeckBlocksSectionProps) {
   return (
      <div className={styles.section}>
         {children}
      </div>
   )
}