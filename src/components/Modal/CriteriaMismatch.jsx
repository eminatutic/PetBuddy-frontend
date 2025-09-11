import React from 'react';
import "./CriteriaMismatch.css";
import Button from '../Button/Button';

function CriteriaMismatch({isOpen, onClose, message}) {
if (!isOpen) return null;
    return (
        <div className="modal-overlay-criteria" onClick={onClose}>
            <div className="modal-content-criteria" onClick={(e) => e.stopPropagation()}>
                <h2>Oops! No Match for your preferences</h2>
                <p>{message}</p>
                <p>Would you consider another option?</p>
                <div className="modal-actions-criteria">
                    <Button
                        className="modal-buttons"
                        onClick={onClose}
                        text="Close"
                    />
                </div>
            </div>
        </div>
    );
}

export default CriteriaMismatch;
