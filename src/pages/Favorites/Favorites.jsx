import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import { Link } from 'react-router-dom';
import './Favorites.css';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { AppContext } from '../../context/AppContext';
import Loader from '../../components/Loader/Loader';

function Favorites() {
    const { authToken } = useContext(AppContext);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [petToRemove, setPetToRemove] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPets = async () => {
        setIsLoading(true);
        try {
            if (!authToken) {
                setError("User is not authenticated.");
                return;
            }
            const response = await axiosInstance.get('/FavoritePets');
            setPets(response.data);
        } catch (err) {
            console.error(err);
            setError("Error loading favorite pets.");
        }
        finally{
            setIsLoading(false);
        }
    };

    const removeFromFavorites = async (petId) => {
        try {
            if (!authToken) {
                setError("User is not authenticated.");
                return;
            }
            await axiosInstance.delete(`/FavoritePets/remove-from-favorites/${petId}`);
            setPets(pets.filter((pet) => pet.id !== petId));
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            setError("Error removing pet from favorites.");
        }
    };

    const handleRemoveClick = (petId) => {
        setPetToRemove(petId);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchPets();
    }, [authToken]);
    
    return (
        <div className="favorite-section">
            <h1>Your favorite pets</h1>
             {isLoading ? (
            <Loader />
            ) : pets.length > 0 ? (
                <div className="favorite-pets-list">
                    {pets.map((pet) => {
                        const statusText = pet.status ? 'Available' : 'Unavailable';

                        return (
                            <div className="favorite-pet-item" key={pet.id}>
                                <img
                                    src={pet.imageUrl}
                                    alt={pet.name}
                                    className="favorite-pet-image"
                                />
                                <div className="favorite-pet-details">
                                    <div className="favorite-pet-header">
                                        <h2>{pet.name}</h2>
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className="favorite-toggle-btn fa-heart"
                                            onClick={() => handleRemoveClick(pet.id)}
                                        />
                                    </div>

                                    <p>Status: {statusText}</p>
                                    <p id="fav-price">Price: {pet.price} €/day</p>
                                    <Link to={`/Pet/${pet.id}`}>
                                        <Button
                                            className="favorite-see-more-btn"
                                            text=" See more"
                                            icon={faAnglesRight}
                                        />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="fav-message">You have no favorite pets.</p>
            )}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={() => {
                    if (petToRemove) {
                        removeFromFavorites(petToRemove);
                    }
                }}
                message="Are you sure you want to remove this pet from your favorites?"
            />
        </div>
    );
}

export default Favorites;
