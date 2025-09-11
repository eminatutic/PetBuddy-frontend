import React from "react";
import Button from "../../components/Button/Button";
import "./DUsers.css"; 


function DUsers({ isOpen, onClose, onActivateClick, users, loading }) {
  if (!isOpen) return null;

  return (
    <div className="dusers-overlay">
      <div className="dusers-modal">
        <h2 className="deactivate-text">Deactivated Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p className="deactivate-text">No deactivated users.</p>
        ) : (
          <ul className="dusers-list">
            {users.map(user => (
              <li key={user.id} className="dusers-item">
                <span>{user.userName} ({user.email})</span>
                <Button
                  text="Activate"
                  className="activate-btn"
                  onClick={() => onActivateClick(user.id)}
                />
              </li>
            ))}
          </ul>
        )}

        <div className="deactivate-text">
          <Button 
            text="Close" 
            className="close-btn"
            onClick={onClose} 
           />
        </div>
      </div>
    </div>
  );
}

export default DUsers;
