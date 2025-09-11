import React from 'react';
import './UserAuthPrompt.css';
import Button from '../Button/Button';
import { Link, useLocation } from 'react-router-dom';

function UserAuthPrompt({isOpen, onClose, message}) {
    const location = useLocation(); 
    if (!isOpen) return null;

    return (
        <div className="auth-prompt-overlay" onClick={onClose}>
            <div className="auth-prompt-content" onClick={(e) => e.stopPropagation()}>
                <p>{message}</p>
                <div className="auth-prompt-actions">
                    <p>
                        Already have an account?{" "}
                        <Link 
                          to="/login" 
                          state={{ from: location }} 
                          onClick={onClose}
                        >
                          Log in here
                        </Link>
                    </p>
                    <p>
                        Don't have an account?{" "}
                        <Link 
                          to="/signup" 
                          state={{ from: location }} 
                          onClick={onClose}
                        >
                          Sign up here
                        </Link>
                    </p>
                </div>
                <Button
                    className="auth-prompt-close-button"
                    onClick={onClose}
                    text="Close"
                />
            </div>
        </div>
    );
}

export default UserAuthPrompt;
