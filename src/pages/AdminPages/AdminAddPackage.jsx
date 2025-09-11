import React, { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import PetCardsPackage from "../../components/Cards/PetCardsPackage";
import axiosInstance from '../../axios/axiosInstance';
import { AnimalTypeEnum, SizeEnum } from "../../enums/enums";
import Filter from '../../components/Filter/Filter';
import "./AdminAddPackage.css";
import Button from "../../components/Button/Button";
import { toast } from 'react-toastify'; 
import { useNavigate } from "react-router-dom";

function AdminAddPackage() {
    const { isAdmin } = useContext(AppContext);  
    const [pets, setPets] = useState([]);
    const [filteredPets, setFilteredPets] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        animalType: [],
        size: [],
        ageRange: '',
        priceRange: ''
    });
    const [selectedPets, setSelectedPets] = useState([]);
    const [packageDescription, setPackageDescription] = useState('');
    const [packagePrice, setPackagePrice] = useState(''); 
    const [priceError, setPriceError] = useState('');
    const [descriptionError, setDescriptionError] = useState(''); 
    const [petSelectionError, setPetSelectionError] = useState('');
    const navigate = useNavigate();
    const fetchPets = async () => {
        try {
        
        const response = await axiosInstance.get('/Pet/available-for-package');
        const availablePets = response.data;
        setPets(availablePets);
        setFilteredPets(availablePets);
    } catch (err) {
        console.log(err.message);
        setError("Error fetching pets.");
    }
    };

    const filterByAnimalType = (pet) => {
        return filters.animalType.length === 0 || filters.animalType.includes(AnimalTypeEnum[pet.animalType]);
    };

    const filterBySize = (pet) => {
        return filters.size.length === 0 || filters.size.includes(SizeEnum[pet.size]);
    };

    const filterByAge = (pet) => {
        if (!filters.ageRange) return true;
        const age = pet.age;
        if (filters.ageRange === "21+") {
            return age >= 21;
        }
        const [min, max] = filters.ageRange.split('-').map(Number);
        return max ? age >= min && age <= max : age >= min;
    };

    const filterByPrice = (pet) => {
        if (!filters.priceRange) return true;
        const price = pet.price;
        if (filters.priceRange === "18+") {
            return price >= 18;  
        }
        const [min, max] = filters.priceRange.split('-').map((value) => parseFloat(value));
        return max ? price >= min && price <= max : price >= min;
    };

    const applyFilters = () => {
        let filtered = [...pets];

        if (searchQuery) {
            filtered = filtered.filter((pet) =>
                pet.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        filtered = filtered.filter(filterByAnimalType)
                           .filter(filterBySize)
                           .filter(filterByAge)
                           .filter(filterByPrice);
        setFilteredPets(filtered);
    };

    const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
    };

    const togglePetSelection = (pet) => {
        if (selectedPets.some(selectedPet => selectedPet.id === pet.id)) {
            setSelectedPets(selectedPets.filter(selectedPet => selectedPet.id !== pet.id));
        } else {
            if (selectedPets.length < 3) {
                setSelectedPets([...selectedPets, pet]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = false;
        let newPetSelectionError = "";
        let newDescriptionError = "";
        let newPriceError = "";

        if (selectedPets.length !== 2 && selectedPets.length !== 3) {
            newPetSelectionError = "You must select exactly 2 (BASIC) or 3 (PREMIUM) pets.";
            errors = true;
        }

        if (packageDescription.trim() === "") {
            newDescriptionError = "Package description is required.";
            errors = true;
        }

        const price = parseFloat(packagePrice);
        if (isNaN(price) || price <= 0) {
            newPriceError = "Invalid price value. Please enter a valid number.";
            errors = true;
        }

        setPetSelectionError(newPetSelectionError);
        setDescriptionError(newDescriptionError);
        setPriceError(newPriceError);

        if (errors) {
            return;
        }
        const createPackageDTO = {
            description: packageDescription,
            price: price,  
            petIds: selectedPets.map((pet) => pet.id),
            packageType: packageType,
        };
        try {
            await axiosInstance.post('/SpecialPackage/create-package', createPackageDTO, {
            });
            toast.success('Package created successfully!');
            setPackageDescription('');
            setPackagePrice('');
            setSelectedPets([]);
            setError(null); 
            fetchPets();
            navigate("/offers");
        } catch (err) {
            console.log(err.response.data);
            setError("Error creating package.");
            toast.error('Error creating package.');
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, searchQuery, pets]);

    const packageType = selectedPets.length === 2 ? 'BASIC' : selectedPets.length === 3 ? 'PREMIUM' : '';

    return (
        <div className={isAdmin ? "admin-add-package" : "add-package-page"}>
            <div className="search-and-text">
                <div className="search-and-result">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <p className="result-info">Result: {filteredPets.length}</p>
                </div>
            </div>

            <div className="pets-side-package">
            <Filter onFilterChange={handleFilterChange} showCategories={true} />
                {error && <p className="error-message-pack-create">{error}</p>}
                
                <div className="pet-form">
                    <form className="package-form">
                        <h3>Create package</h3>
                        <div className="package-inputs">
                            <div className="input-wrapper-package">
                                <textarea
                                    placeholder="Package description"
                                    value={packageDescription}
                                    onChange={(e) => setPackageDescription(e.target.value)}
                                    className="input-description-package"
                                />
                                {descriptionError && <p className="error-message-packagea">{descriptionError}</p>} 
                            </div>
                            <div className="input-wrapper-package">
                                <input
                                    type="number"
                                    placeholder="Package price"
                                    value={packagePrice}
                                    onChange={(e) => setPackagePrice(e.target.value)}
                                    className="input-price-package"
                                    min="0"
                                />
                                {priceError && <p className="error-message-packagea">{priceError}</p>} 
                            </div>
                        </div>
                        <div className="selected-pets">
                            <h4>Selected pets:</h4>
                            {selectedPets.length > 0 ? (
                                selectedPets.map((pet) => (
                                    <span key={pet.id} className="pet-name">{pet.name}</span>
                                ))
                            ) : (
                                <p>No pets selected.</p>
                            )}
                            {petSelectionError && <p className="error-message-packagea">{petSelectionError}</p>}
                        </div>
                        <p>{packageType}</p>
                        <Button
                            className="submit-btn-add-pack"
                            text="Submit"
                            onClick={handleSubmit}
                        />
                    </form>
                    <PetCardsPackage
                        pets={filteredPets}
                        selectedPets={selectedPets}
                        onAdd={togglePetSelection}
                        onRemove={togglePetSelection}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminAddPackage;
