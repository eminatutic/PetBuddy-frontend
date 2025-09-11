import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPercent } from "@fortawesome/free-solid-svg-icons";  
import "./PackageCard.css";

function PackageCard({id, packageType, pets, price, isAdmin, deletePackage, navigateToDetails }) {
  
    const totalPrice = pets?.reduce((total, pet) => total + pet.price, 0) ?? 0;


  const handleDeleteClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    deletePackage(id);
    console.log("Deleting package with id:", id);
  };

  return (
    <div className="package-card-offers">
      {isAdmin && (
        <div className="delete-icon-offers" onClick={handleDeleteClick}>
          <FontAwesomeIcon icon={faTrash} />  
        </div>
      )}
      <div onClick={() => navigateToDetails(id)} className="package-card-link">
        <div>
          <div className="discount-icon">
            <FontAwesomeIcon icon={faPercent} /> 
          </div>
          <h3>{packageType}</h3>
          <div className="pets-container-offers">
        {pets?.length > 0 && pets.map(pet => (
          <div className="pet-card-offers" key={pet.id}>
            <img src={pet.imageUrl} alt={pet.name} className="pet-image-offers" />
            <p className="pet-name-offers">{pet.name}</p>
          </div>
        ))}
          </div>
          <p className="total-price"> {totalPrice}€ per day</p>
          <p className="package-price-offers">
            <strong>Only </strong> {price}€ per day
          </p>
        </div>
      </div>
    </div>
  );
}

export default PackageCard;
