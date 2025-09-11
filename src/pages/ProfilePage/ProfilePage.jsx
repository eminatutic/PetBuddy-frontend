import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axios/axiosInstance";
import { AppContext } from "../../context/AppContext";
import "./ProfilePage.css";
import Button from "../../components/Button/Button";
import ReviewTable from "../../components/Review/ReviewTable";
import Modal from "../../components/Modal/Modal";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import RentalHistoryTable from "../../components/RentalHistory/RentalHistoryTable";
import Loader from "../../components/Loader/Loader";

function ProfilePage() {
  const { authToken, userId } = useContext(AppContext);

  const [userProfile, setUserProfile] = useState(null);
  const [userReviews, setUserReviews] = useState([]);
  const [rentals, setRentals] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingRentals, setLoadingRentals] = useState(true);

  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const fetchUserProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axiosInstance.get(`/User/${userId}`);
      setUserProfile(res.data);
    } catch (err) {
      setError("Failed to fetch profile.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchUserReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await axiosInstance.get(`/Review/get-reviews-by-userId/${userId}`);
      setUserReviews(res.data);
    } catch (err) {
      setError("Failed to fetch reviews.");
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchUserRentals = async () => {
    setLoadingRentals(true);
    try {
      const res = await axiosInstance.get(`/RentInfo/${userId}`);
      setRentals(res.data);
    } catch (err) {
      setError("Failed to fetch rental history.");
    } finally {
      setLoadingRentals(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        OldPassword: oldPassword,
        NewPassword: newPassword,
      };

      await axiosInstance.post(`/User/change-password`, payload);

      toast.success("Password changed successfully!");
      setShowPasswordChange(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (err) {
      if (err.response?.data) {
        setPasswordError(err.response.data);
      } else {
        toast.error("Error updating password.");
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosInstance.delete(`/Review/delete-review/${reviewId}`);
      setUserReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review deleted.");
      handleModalClose();
    } catch {
      toast.error("Failed to delete review.");
    }
  };

  const handleModalOpen = (id) => {
    setReviewToDelete(id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setReviewToDelete(null);
  };

  useEffect(() => {
    if (authToken && userId) {
      fetchUserProfile();
      fetchUserReviews();
      fetchUserRentals();
    }
  }, [authToken, userId]);

  return (
    <div className="profile-page">
      <div className="user-profile">
        <h1>User Profile</h1>

        {loadingProfile ? (
          <Loader />
        ) : userProfile ? (
          <div className="profile-container">
            <div className="profile-details">
              <div className="profile-info">
                <p><strong>Username:</strong> {userProfile.userName}</p>
                <p><strong>Email:</strong> {userProfile.email}</p>
              </div>
              <div className="change-pass-button">
                <Button
                  text="Change password"
                  onClick={() => setShowPasswordChange(!showPasswordChange)}
                  className="change-password-btn"
                />
              </div>
            </div>

            {showPasswordChange && (
              <div className="password-change-form">
                {passwordError && <p className="error-message-password">{passwordError}</p>}

                <div className="password-input-container">
                  <input
                    type="password"
                    placeholder="Old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>

                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>

                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEyeSlash : faEye}
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>

                <Button
                  text="Submit"
                  onClick={handlePasswordChange}
                  className="password-submit-btn"
                />
              </div>
            )}
          </div>
        ) : (
          <p>Profile not found.</p>
        )}

        <h1>Reviews</h1>
        {loadingReviews ? (
          <Loader />
        ) : userReviews.length > 0 ? (
          <ReviewTable
            reviews={userReviews}
            isPendingView={false}
            showEmailUsername={false}
            onDelete={handleModalOpen}
          />
        ) : (
          <p>No reviews yet.</p>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={() => handleDeleteReview(reviewToDelete)}
          message="Are you sure you want to delete this review?"
        />

        <h1>Rental History</h1>
        {loadingRentals ? (
          <Loader />
        ) : rentals.length > 0 ? (
          <RentalHistoryTable rentals={rentals} email={false} />
        ) : (
          <p>No rental history found.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
