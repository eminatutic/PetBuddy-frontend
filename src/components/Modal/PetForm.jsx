import React, { useState, useEffect } from "react";
import "./PetForm.css";
import { AnimalTypeEnum, SizeEnum } from "../../enums/enums";
import Button from "../Button/Button";
import { uploadImageToCloudinary } from "../../utills/cloudinary";

function PetForm({ onClose, onClick, isEditing, petData = {} }) {

    const [imageLoading, setImageLoading] = useState(false);


    const [petName, setPetName] = useState(isEditing && petData.name ? petData.name : "");
    const [petAge, setPetAge] = useState(isEditing && petData.age ? petData.age : "");
    const [petSize, setPetSize] = useState(isEditing && petData.size !== undefined ? petData.size : "");
    const [petStatus, setPetStatus] = useState(isEditing && petData.status !== undefined ? petData.status : true);
    const [petDescription, setPetDescription] = useState(isEditing && petData.description ? petData.description : "");
    const [petPrice, setPetPrice] = useState(isEditing && petData.price ? petData.price : "");
    const [petType, setPetType] = useState(isEditing && petData.animalType !== undefined ? petData.animalType : "");
    const [petImageUrl, setPetImageUrl] = useState(isEditing && petData.imageUrl ? petData.imageUrl : ""); 

    const [nameError, setNameError] = useState("");
    const [ageError, setAgeError] = useState("");
    const [sizeError, setSizeError] = useState("");
    const [priceError, setPriceError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [imageError, setImageError] = useState("");
    const [typeError, setTypeError] = useState("");

   const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
        setImageLoading(true);
        try {
            const imageUrl = await uploadImageToCloudinary(file);
            setPetImageUrl(imageUrl); 
            setPetImageChanged(true); 
        } catch (err) {
            console.log(err.message);
        } finally {
            setImageLoading(false);
        }
    }
};

    const handleSizeChange = (e) => {
        setPetSize(Number(e.target.value));
    };

    const handleTypeChange = (e) => {
        setPetType(Number(e.target.value));
    };

    const handleStatusChange = (e) => {
        setPetStatus(e.target.value === "available" ? true : false);
    };

    const handlePriceChange = (e) => {
        setPetPrice(parseFloat(e.target.value) || 0);  
    };
    
    const validatePetData = () => {
        let isValid = true;

        setNameError("");
        setAgeError("");
        setSizeError("");
        setPriceError("");
        setDescriptionError("");
        setImageError("");
        setTypeError("");

        if (!petName) {
            setNameError("Pet name is required.");
            isValid = false;
        }
        if (!petAge || petAge <= 0) {
            setAgeError("Pet age must be a positive number.");
            isValid = false;
        }
      
        if (!petPrice || petPrice <= 0) {
            setPriceError("Pet price must be a positive number.");
            isValid = false;
        }
        if (!petDescription) {
            setDescriptionError("Pet description is required.");
            isValid = false;
        }

        if (!petImageUrl ) {
            setImageError("Pet image is required.");
            isValid = false;
        } 

        if (!Object.keys(SizeEnum).includes(String(petSize))) {
            setSizeError("Pet size is required.");
            isValid = false;
        }
        
        if (!Object.keys(AnimalTypeEnum).includes(String(petType)) && !isEditing) {
            setTypeError("Animal type is required.");
            isValid = false;
        }
        

        return isValid;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault(); 
        if (validatePetData()) {
            onClick({
                name: petName,
                age: petAge,
                size: petSize,
                status: petStatus,
                description: petDescription,
                price: petPrice,
                animalType: petType,
                imageUrl: petImageUrl, 
            });
        }
    };

    return (
        <div className="pet-form-overlay">
            <div className="pet-form-container">
                <h2>{isEditing ? "Edit pet" : "Add pet"}</h2>
                <form onSubmit={handleFormSubmit}>
                    <div className="both-pet-container">
                        <div className="first-pet-container">
                            <div className="pet-form-group">
                                <label htmlFor="pet-name">Name:</label>
                                <input
                                    type="text"
                                    id="pet-name"
                                    placeholder="Enter pet's name"
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                />
                                {nameError && <p className="error-message-pets-page">{nameError}</p>}
                            </div>

                            <div className="pet-form-group">
                                <label htmlFor="pet-age">Age:</label>
                                <input
                                    type="number"
                                    id="pet-age"
                                    placeholder="Enter pet's age"
                                    value={petAge}
                                    onChange={(e) => setPetAge(e.target.value)}
                                />
                                {ageError && <p className="error-message-pets-page">{ageError}</p>}
                            </div>

                            <div className="pet-form-group">
                                <label htmlFor="pet-size">Size:</label>
                                <select id="pet-size" value={petSize} onChange={handleSizeChange}>
                                    <option value="">Select size</option>
                                    {Object.keys(SizeEnum).map((key) => (
                                        <option key={key} value={key}>
                                            {SizeEnum[key]}
                                        </option>
                                    ))}
                                </select>
                                {sizeError && <p className="error-message-pets-page">{sizeError}</p>}
                            </div>

                            <div className="pet-form-group">
                                <label htmlFor="pet-status">Status:</label>
                                <select id="pet-status" value={petStatus ? "available" : "rented"} onChange={handleStatusChange}>
                                    <option value="available">Available</option>
                                    <option value="rented">Rented</option>
                                </select>
                            </div>

                            <div className="pet-form-group">
                                <label htmlFor="pet-price">Price:</label>
                                <input
                                    type="number"
                                    id="pet-price"
                                    placeholder="Enter price"
                                    value={petPrice}
                                    onChange={handlePriceChange}
                                    min="0"
                                />
                                {priceError && <p className="error-message-pets-page">{priceError}</p>}
                            </div>
                        </div>

                        <div className="second-pet-container">
                            <div className="pet-form-group">
                                <label className="pet-description">Description:</label>
                                <textarea
                                    id="pet-description"
                                    rows="4"
                                    placeholder="Write a description..."
                                    value={petDescription}
                                    onChange={(e) => setPetDescription(e.target.value)}
                                ></textarea>
                                {descriptionError && <p className="error-message-pets-page">{descriptionError}</p>}
                            </div>

                            {!isEditing && (
                                <div className="pet-form-group">
                                    <label htmlFor="pet-type">Animal type:</label>
                                    <select id="pet-type" value={petType} onChange={handleTypeChange}>
                                        <option value="">Select type</option>
                                        {Object.keys(AnimalTypeEnum).map((key) => (
                                            <option key={key} value={key}>
                                                {AnimalTypeEnum[key]}
                                            </option>
                                        ))}
                                    </select>
                                    {typeError && <p className="error-message-pets-page">{typeError}</p>}
                                </div>
                            )}

                          <div className="pet-form-group">
                            <label htmlFor="pet-image">Upload image:</label>
                            <input type="file" id="pet-image" accept="image/*" onChange={handleImageUpload} />
                            
                            {imageLoading && <p className="loading-message">Uploading image...</p>}
                            
                            {petImageUrl && !imageLoading && (
                                <img src={petImageUrl} alt="Pet" className="preview-image" />
                            )}
                            
                            {imageError && <p className="error-message-pets-page">{imageError}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="pet-form-actions">
                        <Button text="Cancel" className="form-button cancel-button" onClick={onClose} />
                        <Button
                            text={isEditing ? "Save changes" : "Add pet"}
                            className="form-button confirm-button"
                            type="submit"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PetForm;
