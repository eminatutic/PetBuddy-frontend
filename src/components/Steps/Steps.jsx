import React from "react";
import "./Steps.css"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faSearch, faPaw, faCreditCard, faTruck } from '@fortawesome/free-solid-svg-icons'; 

function Steps () {

  const steps = [
    {
      icon: faSearch, 
      title: "Search for your perfect pet",
      description: "Browse through our wide selection of pets to find the ideal companion.",
    },
    {
      icon: faPaw, 
      title: "Find and select your pet",
      description: "Once you find the pet that fits your needs, click on the profile to learn more about its personality, price, and availability.",
    },
    {
      icon: faCreditCard, 
      title: "Rent your pet",
      description: "Simply rent your chosen pet and select your payment option – either online or upon delivery.",
    },
    {
      icon: faTruck, 
      title: "Delivery to your home",
      description: "Your rented pet will be delivered to your home address, ready to provide companionship and joy!",
    },
  ];

  return (
    <div className="pet-steps-container">
      <h2>How it works</h2>
      <div className="pet-steps-wrapper">
        {steps.map((step, index) => (
          <div className="pet-step-card" key={index}>
            <div className="pet-step-icon">
              <FontAwesomeIcon icon={step.icon} /> 
            </div>
            <h3 className="pet-step-title">
              {index + 1}. {step.title}
            </h3>
            <div className="pet-step-line"></div>
            <p className="pet-step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Steps;
