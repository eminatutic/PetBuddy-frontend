import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'; 
import './PetSections.css';

function PetSections({petData}) {

  return (
    <div className="pet-sections">
      {petData.map((pet, index) => (
        <Link
          to={pet.buttonLink}
          className="pet-section"
          key={index}
        >
          <div className="pet-section-image">
            <img src={pet.imageUrl} alt={pet.name} />
          </div>
          <div className="pet-section-content">
            <div className="pet-text">
              <h2>{pet.name}</h2>
              <p>{pet.text}</p>
            </div>
          
            <FontAwesomeIcon icon={faChevronDown} className="icon" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PetSections;
