import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import './modal.css';
import { XMarkIcon } from '@heroicons/react/24/solid';

export interface ModalRelativoProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  parentRef: React.RefObject<HTMLElement>;
  position?: 'left' | 'right' | 'center';
  variant?: 'light' | 'dark';
}

export const ModalRelativo: React.FC<ModalRelativoProps> = ({
  isOpen,
  onClose,
  children,
  title,
  parentRef,
  position = 'center',
  variant = 'light',
}) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  // Calcular posición del padre
  useLayoutEffect(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [parentRef, isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keyup', handleKeyUp);
    return () => document.removeEventListener('keyup', handleKeyUp);
  }, [isOpen, onClose]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modalRef.current &&
        !modalRef.current.contains(target) && // click fuera del modal
        parentRef.current &&
        !parentRef.current.contains(target) // click fuera del trigger
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, parentRef]);

  if (!isOpen || !parentRef.current) return null;

  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

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
        ref={modalRef}
        className={`modal-content modal-shadow-only ${variant === 'dark' ? 'dark-modal' : ''}`}
        onClick={handleContentClick}
      >
        <div className={`modal-header ${variant === 'dark' ? 'dark-header' : ''}`}>
          {title && (
            <h2 id="modal-title" className={`modal-title ${variant === 'dark' ? 'dark-title' : ''}`}>
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={`modal-close ${variant === 'dark' ? 'dark-close' : ''}`}
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className={`modal-body ${variant === 'dark' ? 'dark-body' : ''}`}>{children}</div>
      </div>
    </div>
  );
};
