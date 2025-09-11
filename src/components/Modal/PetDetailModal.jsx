import React, { useState, useEffect, useContext } from 'react';
import PetDetail from '../Card/PetDetail';
import './PetDetailModal.css';
import axiosInstance from '../../axios/axiosInstance';
import Button from '../Button/Button';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

function PetDetailModal({pet, onClose}) {

  const { authToken, isUser, isAdmin } = useContext(AppContext);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const onnClick = () => {
  if (pet?.id) {
    navigate(`/rent/${pet.id}?type=pet`);
  }
  };
   const fetchFavoriteStatus = async () => {
      try {
        if (!authToken || !pet?.id || !isUser) return;
        const response = await axiosInstance.get(`/FavoritePets/status/${pet.id}`);
        setIsFavorite(response.data.isFavorite);
      } catch (err) {
        console.log(err.message);
        setError("Error fetching favorite status.");
      }
    };

  useEffect(() => {
    fetchFavoriteStatus();
  }, [authToken, pet?.id, isUser]);

  const toggleFavorite = async () => {
    try {
      if (!authToken) {
        setError("User not authenticated.");
        return;
      }
      if (isFavorite) {
        await axiosInstance.delete(`/FavoritePets/remove-from-favorites/${pet.id}`);
      } else {
        await axiosInstance.post(`/FavoritePets/add-to-favorites/${pet.id}`, null);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.log(err.message);
      setError( "Error updating favorite status.");
    }
  };

  return (
    <div className="pet-detail-modal-overlay">
      <div className="pet-detail-modal-content">
        <Button
          className="pet-detail-modal-close-button"
          onClick={onClose}
          text="x"
        />
        <div className="pet-detail-modal-card">
          <PetDetail 
            pet={pet}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            isUserRole={isUser}
            isAdminRole={isAdmin}
            onClick={onnClick}
            hideAdminOptions={true}
          />
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default PetDetailModal;
