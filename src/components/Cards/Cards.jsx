import React from "react";
import Card from "../Card/Card";
import "./Cards.css";

function Cards({cardData, className = "" }) {
  console.log("Card data:", cardData); 
return (
  <div className={`cards-container ${className}`}>
    {cardData.map((card, index) => (
      <Card
          key={index}
          imageUrl={card.imageUrl}
          nameImage={card.nameImage}
          name={card.name}
          text={card.text}
          type={card.type}
          size={card.size}
          description={card.description}
          status={card.status}
          price={card.price}
          buttonText={card.buttonText}
          buttonLink={card.buttonLink}
          className={className} 
          icon={card.icon}
          iconS={card.iconS}
          title={card.title}
          onDeleteClick={card.onDeleteClick}
          averageRating={card.averageRating}
        

      />
    ))}
  </div>
);
}
export default Cards;
