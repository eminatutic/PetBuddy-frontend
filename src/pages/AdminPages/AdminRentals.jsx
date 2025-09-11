import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import RentalHistoryTable from "../../components/RentalHistory/RentalHistoryTable";
import axiosInstance from "../../axios/axiosInstance";
import Loader from "../../components/Loader/Loader";
import "./AdminRentals.css";

function AdminRentals() {
  const { isAdmin } = useContext(AppContext);
  const [rentals, setRentals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRentals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/RentInfo");
      setRentals(response.data);
      console.log(response.data);
    } catch (err) {
      console.log(err.message);
      setError("Error fetching rental history from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchRentals();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <p>Access denied.</p>;
  }

  return (
    <div className="admin-rentals-a">
      <h1 className="admin-rentals-title">Rental history</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="error-message" style={{ color: "red", padding: "20px" }}>
          {error}
        </div>
      ) : (
        <RentalHistoryTable rentals={rentals} email={true} />
      )}
    </div>
  );
}

export default AdminRentals;
