import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../axios/axiosInstance";
import "./PackageDetails.css";
import { SizeEnum } from "../../enums/enums";
import Modal from "../../components/Modal/Modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';  
import Button from "../../components/Button/Button";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext";
import Loader from "../../components/Loader/Loader";

function PackageDetails() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { authToken, isAdmin } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    console.log("Opening modal to delete package with ID:", id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const deletePackage = async () => {
    if (!authToken) return;
    try {
      await axiosInstance.delete(`/SpecialPackage/delete-package/${id}`);
      toast.success('Package deleted successfully!');
      handleCloseModal();
      navigate("/offers");
    } catch (error) {
      setError("Error deleting package.");
      toast.error('Error deleting package. Please try again.');
    }
  };

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/SpecialPackage/get-package-by-id/${id}`);
      setPackageData(response.data);
    } catch (error) {
      setError("Error fetching package details.");
    }
    finally {
    setLoading(false);
  }
  };

  const handleRent = () => {
    navigate(`/rent/${id}?type=package`);
  };

  useEffect(() => {
    fetchPackageDetails();
  }, [id]);
  
 return (
  <>
    <div className="package-details">
      {loading && <Loader />}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          {!isAdmin && !packageData.isDeleted && (
            <Button
              text="RENT PETS"
              onClick={handleRent}
              className="rent-package-button"
            />
          )}

          {isAdmin && !packageData.isDeleted && (
            <FontAwesomeIcon
              icon={faTrash}
              className="delete-icon-pack"
              onClick={handleOpenModal}
              title="Delete this package"
            />
          )}

          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              message={`Are you sure you want to delete this package?`}
              onClose={handleCloseModal}
              onConfirm={deletePackage}
            />
          )}

          <h2>{packageData.packageType}</h2>
          <p className="package-price">Only {packageData.price}€ per day</p>
          <p className="package-description">{packageData.description}</p>

          <h3>Included pets:</h3>
          <div className="pets-list">
            {packageData.specialPackagePets?.length > 0 ? (
              packageData.specialPackagePets.map(({ pet }) => {
                const size =
                  typeof pet.size === "number" && SizeEnum[pet.size] !== undefined
                    ? SizeEnum[pet.size]
                    : "Unknown";

                return (
                  <div className="pet-card-details" key={pet.id}>
                    <img
                      src={pet.imageUrl || "/images/cat.jpg"}
                      alt={pet.name}
                      className="pet-image-details"
                    />
                    <div className="pet-info">
                      <h4>{pet.name}</h4>
                      <p>Age: {pet.age} months</p>
                      <p>Size: {size}</p>
                      <p>{pet.description}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No pets included in this package.</p>
            )}
          </div>
        </>
      )}
    </div>
  </>
);

}

export default PackageDetails;
