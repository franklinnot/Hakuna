import React from "react";
import "./modal.css";
import { XMarkIcon } from "@heroicons/react/24/solid";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  // evitar que los clics dentro del modal lo cierren
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <div className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button onClick={onClose} className="modal-close">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};
