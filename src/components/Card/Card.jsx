import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons'; 
import "./Card.css";

function Card({
  imageUrl, 
  nameImage,
  name, 
  text,
  type, 
  size, 
  description, 
  status, 
  price, 
  buttonText, 
  buttonLink, 
  className = "", 
  icon, 
  iconS,
  title,
  onDeleteClick,
  averageRating
}) {
  return (
    <div className={`pet-card ${className}`}>
      <div className="pet-image-container">
        {imageUrl && <img src={imageUrl} alt={nameImage} loading="lazy" className="pet-image" />}
        {iconS && (
          <FontAwesomeIcon 
            icon={faTrashAlt}  
            className={`icon-class-card ${iconS}`}
            title={title}
            onClick={onDeleteClick}
          />
        )}
      </div>
      
      <div className="card-header">
        {name && <h2>{name}</h2>}
      </div>

      <div className="rating-price-container">
  {status === true ? (  
    <>
      {price && <p id="priceCard">{price} €/day</p>}
      {averageRating > 0 && (
        <p id="average-on-card">
          ({averageRating.toFixed(1)} / 5 
          <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} />
          )
        </p>
      )}
    </>
  ) : (
    <p id="unavailable">Unavailable</p>  
  )}
</div>
      {text && <p>{text}</p>}
      {type && <p>Type: {type}</p>}
      {size && <p>Size: {size}</p>}
      {description && <p className="description">{description}</p>}
      
      <div className="card-footer">
        {buttonText && buttonLink && (
          <Link to={buttonLink}>
            <Button className={`see-more-btn ${className}`} text={buttonText} icon={icon} />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Card;
