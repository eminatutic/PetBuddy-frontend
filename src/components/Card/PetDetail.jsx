import React from 'react';
import { SizeEnum } from "../../enums/enums";
import './PetDetail.css'; 
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';  



function PetDetail({pet, isFavorite, toggleFavorite, isUserRole, isAdminRole, onDeleteClickP, editPen, onClick, hideAdminOptions
}) {
  
  const size = SizeEnum[pet.size] || 'Unknown';
  const statusText = pet.status === true ? 'Available' : 'Unavailable';


  return (
    <div className="pet-cardD">
      <div className="image-containerD">
        <img src={pet.imageUrl} className="pet-imageD" alt={pet.name} />
      </div>
      <div className="info-containerD">
        <div className="type">
          <div className="typeandheart">
            <div className="type2">
              <h2>{pet.name}</h2>
            </div>
            <div className="heart">
              {isUserRole && !pet.isDeleted  && (
               <FontAwesomeIcon
               icon={faHeart}
               className={`favorite-icon ${isFavorite ? 'favorited' : ''}`} 
               onClick={toggleFavorite}
               title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              />
              )}
              {!hideAdminOptions && isAdminRole && !pet.isDeleted && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="pet-details-trash"
                  onClick={onDeleteClickP}
                  title="Delete this pet"
                />
              )}
             {!hideAdminOptions && isAdminRole && !pet.isDeleted && (
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="edit-icon pencil"
                  onClick={editPen}
                  title="Edit pet details"
                />
              )}
            </div>
          </div>
        </div>
        <div className="other">
          <p>Size: {size}</p>
          <p>Age: {pet.age === 1 ? "1 month" : `${pet.age} months`}</p>
          <p>{pet.description}</p>
          <div className='status-detail-container'>
          <p id='status-detail'>Status: {statusText}</p>
          </div>
          <div className="price-container">
            <p id="price">Price: {pet.price} €/day</p>
          </div>
        </div>
        {!isAdminRole && statusText === 'Available' && (
          <div className="rent-button-container">
            <Button
              text="RENT"
              className="rent-button"
              onClick={onClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetail;
