import { useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

export function ConfirmationModal({ title, message, confirmText, cancelText, onConfirm, onCancel, isDangerous }: {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      isOpen
      onClose={onCancel}
      title={title}
      description={message}
      size="sm"
      alert
      initialFocusRef={confirmRef}
      footer={
        <div className="admin-modal-actions">
          <button type="button" onClick={onCancel} className="workspace-button">{cancelText}</button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={isDangerous ? 'workspace-button workspace-button-danger' : 'workspace-button workspace-button-primary'}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <div className={`admin-confirmation-illustration ${isDangerous ? 'is-danger' : ''}`} aria-hidden="true">
        <AlertCircle size={28} />
      </div>
      <p className="admin-confirmation-copy">{message}</p>
    </Modal>
  );
}
