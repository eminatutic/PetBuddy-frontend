import React from 'react';
import './Modal.css';
import Button from '../Button/Button';

function Modal({isOpen, onClose, onConfirm, message}) {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="modal-actions">
                    <Button
                        className="modal-buttons"
                        onClick={onConfirm}
                        text="Confirm"
                    />
                    <Button
                        className="modal-buttons"
                        onClick={onClose}
                        text="Cancel"
                    />
                </div>
            </div>
        </div>
    );
}

export default Modal;
