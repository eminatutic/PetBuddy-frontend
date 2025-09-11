import React, { useState, useEffect, useContext } from 'react';
import './SurveyPage.css';
import { AnimalTypeEnum, SizeEnum } from "../../enums/enums";  
import axiosInstance from '../../axios/axiosInstance';
import PetDetailModal from '../../components/Modal/PetDetailModal';
import Button from '../../components/Button/Button';
import CriteriaMismatch from '../../components/Modal/CriteriaMismatch';
import UserAuthPrompt from "../../components/Modal/UserAuthPrompt"; 
import { AppContext } from '../../context/AppContext';


function SurveyPage() {
    const [formData, setFormData] = useState({
        animalType: "",  
        size: "",        
        ageInMonths: "", 
        experience: "",
        lifestyle: [],
        allergies: "",
        rentalDuration: []
    });
    const[error, setError]= useState(null);
    const [randomPet, setRandomPet] = useState(null); 
    const [isSurveySubmitted, setIsSurveySubmitted] = useState(false); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAdmin, isUser } = useContext(AppContext);
    const [errorMessages, setErrorMessages] = useState({});
    const [showMismatch, setShowMismatch] = useState(false);
    const [mismatchMessage, setMismatchMessage] = useState("");
    const [noMatchingAnimalType, setNoMatchingAnimalType] = useState(false);
    const [noMatchingSize, setNoMatchingSize] = useState(false);
    const [noMatchingAge, setNoMatchingAge] = useState(false);
   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);


    const validateForm = () => {
        let errors = {};

        if (!formData.animalType) errors.animalType = "Please select an animal type.";
        if (!formData.size) errors.size = "Please select a pet size.";
        if (formData.ageInMonths.length === 0) errors.ageInMonths = "Please select at least one age range.";
        if (!formData.experience) errors.experience = "Please select if you have experience with pets.";
        if (formData.lifestyle.length === 0) errors.lifestyle = "Please select at least one lifestyle option.";
        if (formData.rentalDuration.length === 0) errors.rentalDuration = "Please select at least one rental duration.";

        setErrorMessages(errors);

        return Object.keys(errors).length === 0;
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); 
        setRandomPet(null);
        setIsSurveySubmitted(false); 
        setShowMismatch(false);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        setFormData({
            ...formData,
            [name]: type === 'checkbox'
                ? checked
                    ? [...formData[name], value]
                    : formData[name].filter((item) => item !== value)
                : value,
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        if(!isUser && !isAdmin){
            setIsLoginModalOpen(true);
            setIsSurveySubmitted(false);
            setIsModalOpen(false); 
        }
        else{
        if (!validateForm()) return;
        let selectedAge = formData.ageInMonths;
        if (selectedAge === "21+") {
            selectedAge = ">=21"; 
        }
        setIsSurveySubmitted(true); 
        setIsModalOpen(true);  
    }
    };
    
    const fetchPets = async () => {
        try {
            const response = await axiosInstance.get('/Pet/all-pets');
            const pets = response.data;
            const filteredPets = pets.filter((pet) => {
                return (
                    pet.status === true &&
                    (formData.animalType === "" || formData.animalType === "all" || formData.animalType === AnimalTypeEnum[pet.animalType]) &&
                    (formData.size === "" || formData.size === "all" || formData.size === SizeEnum[pet.size]) &&
                    (formData.ageInMonths === "all" || 
                        (formData.ageInMonths === "0-6" && pet.age >= 0 && pet.age <= 6) ||
                        (formData.ageInMonths === "7-13" && pet.age >= 7 && pet.age <= 13) ||
                        (formData.ageInMonths === "14-20" && pet.age >= 14 && pet.age <= 20) ||
                        (formData.ageInMonths === "21+" && pet.age >= 21)
                    )
                );
            });
    
            if (filteredPets.length > 0) {
                const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];
                setRandomPet(randomPet);
                setNoMatchingAnimalType(false);
                setNoMatchingSize(false);
                setNoMatchingAge(false);
                setShowMismatch(false); 
            } else {
                setRandomPet(null);
                let mismatchMessage = "No pets match your criteria.";
    
                if (formData.animalType && formData.animalType !== "all" && !filteredPets.some((pet) => pet.animalType === formData.animalType)) {
                    mismatchMessage = "No matching animal type found.";
                    setNoMatchingAnimalType(true);
                } else {
                    setNoMatchingAnimalType(false);
                }
                if (formData.size && formData.size !== "all" && !filteredPets.some((pet) => pet.size === formData.size)) {
                    mismatchMessage = "No matching pet size found.";
                    setNoMatchingSize(true);
                } else {
                    setNoMatchingSize(false);
                }
                if (formData.ageInMonths && formData.ageInMonths !== "all" && !filteredPets.some((pet) => {
                    if (formData.ageInMonths === "0-6") return pet.age >= 0 && pet.age <= 6;
                    if (formData.ageInMonths === "7-13") return pet.age >= 7 && pet.age <= 13;
                    if (formData.ageInMonths === "14-20") return pet.age >= 14 && pet.age <= 20;
                    if (formData.ageInMonths === "21+") return pet.age >= 21;
                    return false;
                })) {
                    mismatchMessage = "No matching age range found.";
                    setNoMatchingAge(true);
                } else {
                    setNoMatchingAge(false);
                }
                setShowMismatch(true); 
                setMismatchMessage(mismatchMessage); 
            }
        } catch (error) {
            setError('Error fetching pets:', error);
        }
    };
    
    
    useEffect(() => {
        if (isSurveySubmitted) { 
            console.log('Fetching pets...');
            fetchPets();
        }
    }, [isSurveySubmitted]); 

    return (
        <div className='survey-page'>
        <div className="survey-card">
            <h1 id="title">Pet rental survey</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Which pet would you like?</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="animalType"
                                value="all"
                                onChange={handleChange}
                                checked={formData.animalType === "all"}
                            />
                            All
                        </label>
                        {Object.values(AnimalTypeEnum).map((type) => (
                            <label key={type}>
                                <input
                                    type="radio"
                                    name="animalType"
                                    value={type}
                                    onChange={handleChange}
                                    checked={formData.animalType === type}
                                />
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </label>
                        ))}
                    </div>
                    {errorMessages.animalType && <p className="error">{errorMessages.animalType}</p>}
                </div>

                <div className="form-group">
                    <label>What size pet would you prefer?</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="size"
                                value="all"
                                onChange={handleChange}
                                checked={formData.size === "all"}
                            />
                            All
                        </label>
                        {Object.values(SizeEnum).map((size) => (
                            <label key={size}>
                                <input
                                    type="radio"
                                    name="size"
                                    value={size}
                                    onChange={handleChange}
                                    checked={formData.size === size}
                                />
                                {size.charAt(0).toUpperCase() + size.slice(1)}
                            </label>
                        ))}
                    </div>
                    {errorMessages.size && <p className="error">{errorMessages.size}</p>}
                </div>

                <div className="form-group">
                    <label>What age of pet would you prefer?</label>
                    <div>
                        {["all", "0-6", "7-13", "14-20", "21+"].map((age) => (
                            <label key={age}>
                                <input
                                    type="radio"
                                    name="ageInMonths"
                                    value={age}
                                    onChange={handleChange}
                                    checked={formData.ageInMonths === age}
                                />
                                {age === "all" ? "All" : `${age} months`}
                            </label>
                        ))}
                    </div>
                    {errorMessages.ageInMonths && <p className="error">{errorMessages.ageInMonths}</p>}
                </div>

                <div className="form-group">
                    <label>Do you have previous experience with pets?</label>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="yes"
                                onChange={handleChange}
                            />
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="experience"
                                value="no"
                                onChange={handleChange}
                            />
                            No
                        </label>
                    </div>
                    {errorMessages.experience && <p className="error">{errorMessages.experience}</p>}
                </div>

                <div className="form-group">
                    <label>Do you have allergies to pets? (Please specify)</label>
                    <textarea
                        name="allergies"
                        value={formData.allergies}
                        onChange={handleChange}
                        placeholder="Enter your allergies (if any)"
                    />
                    {errorMessages.allergies && <p className="error">{errorMessages.allergies}</p>}
                </div>

                <div className="form-group">
                    <label>How would you describe your lifestyle?</label>
                    <div>
                        {["active", "calm", "mixed"].map((lifestyle) => (
                            <label key={lifestyle}>
                                <input
                                    type="checkbox"
                                    name="lifestyle"
                                    value={lifestyle}
                                    onChange={handleChange}
                                />
                                {lifestyle.charAt(0).toUpperCase() + lifestyle.slice(1)}
                            </label>
                        ))}
                    </div>
                    {errorMessages.lifestyle && <p className="error">{errorMessages.lifestyle}</p>}
                </div>

                <div className="form-group">
                    <label>How long would you like to rent the pet?</label>
                    <div>
                        {["short", "medium", "long"].map((duration) => (
                            <label key={duration}>
                                <input
                                    type="checkbox"
                                    name="rentalDuration"
                                    value={duration}
                                    onChange={handleChange}
                                />
                                {duration === "short" ? "Short term (1 week - 1 month)" :
                                    duration === "medium" ? "Medium term (1-3 months)" :
                                        "Long term (3+ months)"}
                            </label>
                        ))}
                    </div>
                    {errorMessages.rentalDuration && <p className="error">{errorMessages.rentalDuration}</p>}
                </div>

                <Button
                    className="submit-btn"
                    text="Submit"
                    type="submit"
                    onClick={handleSubmit}
                />
            </form>

            {isModalOpen && randomPet && (
                <PetDetailModal
                    pet={randomPet}
                    onClose={handleCloseModal}
                    isUserRole={isUser}
                    
                />
            )}
            {showMismatch && (
                <CriteriaMismatch
                    isOpen={showMismatch}
                    onClose={handleCloseModal}
                    message={mismatchMessage}  
                />
            )}
            {isLoginModalOpen && (
            <UserAuthPrompt
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                message="To submit the survey, please log in or sign up."

            />
            )}
        </div>
    </div>
    );
}

export default SurveyPage;
