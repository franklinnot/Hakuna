import React, { useEffect, useLayoutEffect, useState } from 'react';
import './modal.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  relativeToParent?: boolean;
  parentRef?: React.RefObject<HTMLElement>; // referencia del padre
  position?: 'left' | 'right' | 'center'; // posición relativa horizontal
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  relativeToParent = false,
  parentRef,
  position = 'center',
}: ModalProps) => {
  const [coords, setCoords] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Captura la posición del elemento padre
  useLayoutEffect(() => {
    if (relativeToParent && parentRef?.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [relativeToParent, parentRef, isOpen]);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleModalContentClick = (e: React.MouseEvent) => e.stopPropagation();

  if (relativeToParent && parentRef?.current) {
    // --- MODO RELATIVO AL PADRE ---
    return (
      <div
        className="modal-relative-container"
        style={{
          position: 'fixed',
          top: coords.top,
          left:
            position === 'left'
              ? coords.left + 70
              : position === 'right'
              ? coords.left + parentRef.current.offsetWidth
              : coords.left + parentRef.current.offsetWidth / 2,
          transform:
            position === 'center'
              ? 'translateX(-50%)'
              : position === 'right'
              ? 'translateX(-100%)'
              : 'none',
          zIndex: 1000,
        }}
      >
        <div
          className="modal-content modal-shadow-only"
          onClick={handleModalContentClick}
        >
          <div className="modal-header">
            {title && (
              <h2 id="modal-title" className="modal-title">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="modal-close"
              aria-label="Cerrar modal"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }

  // --- MODO GLOBAL (normal) ---
  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          {title && (
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
