import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import "./PetDetailsPage.css";
import PetForm from "../../components/Modal/PetForm"; 
import Modal from "../../components/Modal/Modal";
import PetDetail from "../../components/Card/PetDetail";
import ReviewForm from "../../components/Review/ReviewForm";
import ReviewList from "../../components/Review/ReviewList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserAuthPrompt from "../../components/Modal/UserAuthPrompt"; 
import { AppContext } from "../../context/AppContext";  
import Loader from "../../components/Loader/Loader";


function PetDetailsPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { authToken, userId, isAdmin, isUser } = useContext(AppContext);
  const [pet, setPet] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [isModalOpenP, setIsModalOpenP] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleteModalOpenP, setIsDeleteModalOpenP] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  const onnClick = () => {
    if (!isUser) {
      setIsLoginModalOpen(true); 
    } else {
      navigate(`/rent/${petId}?type=pet`); 
    }
  };

 const fetchPetDetails = async () => {
  try {
    const response = await axiosInstance.get(`/Pet/${petId}`);
    setPet(response.data);
    if (authToken && isUser) {
      try {
        const favoriteResponse = await axiosInstance.get(`/FavoritePets/status/${petId}`);
        setIsFavorite(favoriteResponse.data);
      } catch (err) {
        console.log("Error fetching favorite status:", err.message);
      }

      try {
        const pendingReviewResponse = await axiosInstance.get(
          `/Review/pending-reviews-for-user/${petId}`
        );
        setPendingReviews(pendingReviewResponse.data);
      } catch (err) {
        console.log("Error fetching pending reviews:", err.message);
        setPendingReviews([]);
      }
    }

    try {
      const reviewResponse = await axiosInstance.get(`/Review/${petId}`);
      setReviews(reviewResponse.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setReviews([]);
      } else {
        console.log("Error fetching reviews:", err.message);
        setError(err.message || "Error fetching reviews.");
      }
    }
  } catch (err) {
    console.log("Error fetching pet details:", err.message);
    setError(err.message || "Error fetching pet details.");
  }
   finally {
      setLoading(false); 
    }
};


  const toggleFavorite = async () => {
    try {
      if (!authToken) {
        setError("User not authenticated.");
        return;
      }
      if (isFavorite) {
        await axiosInstance.delete(`/FavoritePets/remove-from-favorites/${petId}`);
      } else {
        await axiosInstance.post(`/FavoritePets/add-to-favorites/${petId}`, null);
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      setError(err.message || "Error updating favorite status.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!authToken) {
        setError("User not authenticated.");
        return;
      }
      const reviewData = { petId, comment: newReview, rating };
      await axiosInstance.post(`/Review/create-review`, reviewData);
      toast.success("Review submitted successfully!");
      fetchPetDetails();
      setNewReview('');
      setRating(0);
    } catch (error) {
      setError("Error submitting review.");
      toast.error("Error submitting review.");
    }
  };

  const handleUpdatePet = async (updatedPet) => {
    try {
      if (!authToken) {
        toast.error("You need to be logged in to update pet details.");
        return;
      }
      const response = await axiosInstance.put(`/Pet/update-pet/${petId}`, updatedPet);
      setPet(response.data);
      setIsModalOpenP(false);
      toast.success("Pet updated successfully!");
    } catch (error) {
      setError('Error updating pet');
      toast.error("There was an error updating the pet.");
    }
  };

  const onCloseModal = () => {
    setIsModalOpenP(false);
  };

  const handleDeleteClickP = (id) => {
    setPetToDelete(id);
    setIsDeleteModalOpenP(true);
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;
    try {
      if (!authToken) {
        setError("No token found");
        toast.error("You need to be logged in to delete a pet.");
        return;
      }
      await axiosInstance.delete(`/Pet/delete-pet/${petToDelete}`);
      setIsDeleteModalOpenP(false);
      setPetToDelete(null);
      toast.success("Pet deleted successfully!");
      navigate("/pets");
    } catch (err) {
      setError("Error deleting pet");
      toast.error("There was an error deleting the pet.");
    }
  };

  // Delete review modal open/close
  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalOpen(true);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteReview = async () => {
    try {
      if (!authToken) {
        setError("User not authenticated.");
        toast.error("You need to be logged in to delete a review.");
        return;
      }
      const response = await axiosInstance.delete(`/Review/delete-review/${reviewToDelete}`);
      if (response.status === 204) {
        setReviews(reviews.filter(review => review.id !== reviewToDelete));
        setPendingReviews(pendingReviews.filter(review => review.id !== reviewToDelete));
        setIsDeleteModalOpen(false);
        toast.success("Review deleted successfully!");
      } else {
        setError("Failed to delete review.");
        toast.error("Failed to delete review.");
      }
    } catch (error) {
      setError("Error deleting review.");
      toast.error("Error deleting review.");
    }
  };

  useEffect(() => {
    fetchPetDetails();
  }, [petId, authToken, isUser, isAdmin]);

 

return (
  <>
    <div className="pet-details-page-all-page">
      {loading && <Loader />}
      {error && <div className="error-message">{error}</div>}

      {!loading && !error && pet && (
        <>
          <PetDetail 
            pet={pet}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isUserRole={isUser}
            isAdminRole={isAdmin}
            editPen={() => setIsModalOpenP(true)} 
            onDeleteClickP={() => handleDeleteClickP(pet.id)} 
            onClick={onnClick}
          />

          {isAdmin && isModalOpenP && (
            <div className="modalP">
              <div className="modal-contentP">
                <PetForm 
                  isEditing={true} 
                  petData={pet} 
                  onSubmit={handleUpdatePet}  
                  onClick={handleUpdatePet}
                  onClose={onCloseModal}
                /> 
              </div>
            </div>
          )}

          {isLoginModalOpen && (
            <UserAuthPrompt
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              message="You need to be logged in to rent a pet. Please log in or sign up."
            />
          )}

          {isDeleteModalOpenP && (
            <Modal
              isOpen={isDeleteModalOpenP}
              onClose={() => setIsDeleteModalOpenP(false)}
              onConfirm={handleConfirmDelete}
              message={`Are you sure you want to delete this pet?`}
            />
          )}

          <div className="reviews-section">
            <h3>Reviews</h3>
            <p id="average">
              {pet.averageRating > 0 && (
                <>
                  {pet.averageRating.toFixed(1)} / 5 
                  <FontAwesomeIcon icon={faStar} style={{ color: 'gold' }} />
                </>
              )}
            </p>

            {isUser && !pet.isDeleted && (
              <ReviewForm
                newReview={newReview}
                setNewReview={setNewReview}
                rating={rating}
                setRating={setRating}
                handleReviewSubmit={handleReviewSubmit}
              />
            )}

            <ReviewList
              reviews={reviews}
              pendingReviews={pendingReviews}
              userId={userId}
              handleDeleteClick={handleDeleteClick}
              isAdminRole={isAdmin}
            />
          </div>

          {isDeleteModalOpen && (
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={handleCancelDelete} 
              onConfirm={handleDeleteReview} 
              message="Are you sure you want to delete this review?"
            />
          )}
        </>
      )}
    </div>
  </>
);
}
export default PetDetailsPage;
