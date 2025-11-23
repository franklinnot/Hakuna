import React, { useEffect } from 'react';
import './modal.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  preventClose?: boolean;
  variant?: 'light' | 'dark';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  preventClose = false,
  variant = 'light',
}) => {
  // cerrar con tecla Escape (si no está bloqueado)
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClose) onClose();
    };

    if (isOpen) document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [isOpen, onClose, preventClose]);

  if (!isOpen) return null;

  // Evitar propagación del clic dentro del modal
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  // Solo cerrar con clic afuera si no está bloqueado
  const handleBackdropClick = () => {
    if (!preventClose) onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`modal-content modal-content-up ${variant === 'dark' ? 'dark-modal' : ''}`}
        onClick={handleContentClick}
      >
        <div className={`modal-header ${variant === 'dark' ? 'dark-header' : ''}`}>
          {title && (
            <h2 id="modal-title" className={`modal-title ${variant === 'dark' ? 'dark-title' : ''}`}>
              {title}
            </h2>
          )}
          <button
            onClick={!preventClose ? onClose : undefined}
            className={`modal-close ${variant === 'dark' ? 'dark-close' : ''}`}
            aria-label="Cerrar modal"
            disabled={preventClose}
            style={preventClose ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className={`modal-body ${variant === 'dark' ? 'dark-body' : ''}`}>{children}</div>
      </div>
    </div>
  );
};
