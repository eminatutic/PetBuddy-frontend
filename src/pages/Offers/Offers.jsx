import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../axios/axiosInstance";
import './Offers.css';
import PackageCards from "../../components/Cards/PackageCards";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import { toast } from 'react-toastify'; 
import UserAuthPrompt from "../../components/Modal/UserAuthPrompt"; 
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader/Loader";

function Offers() {
  const { authToken, isAdmin, isUser } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/SpecialPackage/get-all-packages');
      setPackages(response.data);
      console.log("Packages from backend:", response.data);
      setError(null); 
    } catch (error) {
      setError("Sorry, we couldn't fetch the packages at this moment. Please try again later.");
    }
    finally{
      setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    }
  };

  const handleOpenModal = (packageId) => {
    setIsModalOpen(true);
    setPackageToDelete(packageId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPackageToDelete(null);
  };

  const deletePackage = async () => {
    if (!authToken) {
      setError("User is not authenticated.");
      return;
    }

    try {
      await axiosInstance.delete(`/SpecialPackage/delete-package/${packageToDelete}`);
      toast.success('Package deleted successfully!');
      fetchPackages();
      handleCloseModal();
    } catch (error) {
      setError("Error deleting package.");
      toast.error('Error deleting package. Please try again.');
    }
  };

  const navigateToDetails = (id) => {
    if (isUser || isAdmin) {
      navigate(`/package-details/${id}`);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <div className="offers">
      <div className="offers-header">
        <h2>Exclusive pet packages just for you!</h2>
        <p className="offers-text">
          Discover our carefully selected pet packages and treat yourself and your future furry friend. Take advantage of special discounts and limited-time offers you won’t want to miss!
        </p>
        <p className="exclusive-note">
          Only for our registered users! Enjoy even more perks and special deals by signing up today.
        </p>
        {isAdmin && (
          <Button
            className="add-package-btn" 
            onClick={() => navigate('/admin/add-package')}
            text="+ Add package"
          />
        )}
      </div>
    {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="error-message-offers">{error}</p>
      ) : packages.length === 0 ? (
        <p className="no-packages-message">No available packages.</p>
      ) : (
        <PackageCards 
          packages={packages}
          isAdmin={isAdmin}
          deletePackage={handleOpenModal}
          navigateToDetails={navigateToDetails}
        />
      )}

      {isLoginModalOpen && (
        <UserAuthPrompt
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          message="Special offers are only available for our registered users. Please log in or sign up."
        />
      )}

      {isModalOpen && isAdmin && (
        <Modal
          isOpen={isModalOpen}
          message={`Are you sure you want to delete this package?`}
          onClose={handleCloseModal}
          onConfirm={deletePackage}
        />
      )}
    </div>
  );
}

export default Offers;
