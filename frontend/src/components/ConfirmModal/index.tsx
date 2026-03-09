import styles from './styles.module.css';

type ConfirmModalProps = {
   message: string;
   confirmLabel?: string;
   cancelLabel?: string;
   onConfirm: () => void;
   onCancel: () => void;
}

export function ConfirmModal({
   message,
   confirmLabel = 'Excluir',
   cancelLabel = 'Cancelar',
   onConfirm,
   onCancel,
}: ConfirmModalProps) {
   return (
      <div className={styles.overlay} onClick={onCancel}>
         <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.message}>{message}</p>
            <div className={styles.actions}>
               <button className={styles.cancelButton} onClick={onCancel}>{cancelLabel}</button>
               <button className={styles.confirmButton} onClick={onConfirm}>{confirmLabel}</button>
            </div>
         </div>
      </div>
   );
}