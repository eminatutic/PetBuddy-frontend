import React from 'react';
import './Button.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 


function Button({text, className, onClick, icon, disabled, title}) {

  return (
    <button className={className} onClick={onClick} disabled={disabled} title={title}>
      { icon && <FontAwesomeIcon icon={ icon } />} 
      { text }
    </button>
  );
}

export default Button;
