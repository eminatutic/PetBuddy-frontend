import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../../axios/axiosInstance';  
import "./AdminReviewsPage.css";
import Modal from "../../components/Modal/Modal";
import ReviewTable from "../../components/Review/ReviewTable";  
import Button from '../../components/Button/Button';
import Loader from "../../components/Loader/Loader";
import { AppContext } from '../../context/AppContext'; 
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminReviewsPage() {
  const { isAdmin } = useContext(AppContext); 
  const [reviews, setReviews] = useState([]); 
  const [allReviews, setAllReviews] = useState([]);  
  const [isPendingView, setIsPendingView] = useState(true);  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [reviewToApprove, setReviewToApprove] = useState(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPendingReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/Review/pending-reviews');
      setReviews(response.data);
    } catch (err) {
      console.log(err.message);
      setError("Error fetching pending reviews from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/Review/all-reviews');
      setAllReviews(response.data);
    } catch (err) {
      console.log(err.message);
      setError("Error fetching all reviews from server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowPendingReviews = () => {
    setIsPendingView(true);
    fetchPendingReviews();
  };

  const handleShowAllReviews = () => {
    setIsPendingView(false);
    fetchAllReviews();
  };

  const handleDeleteReview = async (reviewId) => {
    if (!reviewId) return;
    try {
      await axiosInstance.delete(`/Review/delete-review/${reviewId}`);

      setReviews(reviews.filter(review => review.id !== reviewId));
      setAllReviews(allReviews.filter(review => review.id !== reviewId));

      handleModalClose();
      toast.success("Review deleted successfully!");
    } catch (err) {
      console.log(err.message);
      setError("Error deleting review from server.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setReviewToDelete(null);
  }

  const handleModalOpen = (reviewId) => {
    setReviewToDelete(reviewId);  
    setIsModalOpen(true);
  }

  const handleApproveReview = async () => {
    if (!reviewToApprove) return;
    try {
      await axiosInstance.post(`/Review/approve-review/${reviewToApprove}`);
      setReviews(reviews.filter(review => review.id !== reviewToApprove));
      toast.success("Review approved successfully!");
      setIsAppModalOpen(false);
    } catch (err) {
      console.log(err.message);
      setError("Error approving review on server.");
    }
  };

  const handleOpenAppModal = (reviewId) => {
    setReviewToApprove(reviewId);
    setIsAppModalOpen(true);
  };

  const handleCloseAppModal = () => {
    setIsAppModalOpen(false);
    setReviewToApprove(null);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingReviews();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <p>Access denied.</p>;
  }

  return (
    <div className="admin-reviews-page">
      <div className="admin-button-container-a">
        <Button
          className={`admin-button-a ${isPendingView ? 'active' : ''}`}
          onClick={handleShowPendingReviews}
          text="Show pending reviews"
        />
        <Button
          className={`admin-button-a ${!isPendingView ? 'active' : ''}`}
          onClick={handleShowAllReviews}
          text="Show all reviews"
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="error-message" style={{ color: "red", padding: "20px" }}>
          {error}
        </div>
      ) : (
        <ReviewTable
          reviews={isPendingView ? reviews : allReviews}
          onApprove={handleOpenAppModal}
          onDelete={handleModalOpen}
          isPendingView={isPendingView}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={() => handleDeleteReview(reviewToDelete)}
        message="Are you sure you want to delete this review?"
      />

      <Modal
        isOpen={isAppModalOpen}
        onClose={handleCloseAppModal}
        onConfirm={handleApproveReview}
        message="Are you sure you want to approve this review?"
      />
    </div>
  );
}

export default AdminReviewsPage;
