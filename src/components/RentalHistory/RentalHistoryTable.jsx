import React from "react";
import { Link } from "react-router-dom";
import "./RentalHistoryTable.css";
import { PaymentMethodEnum } from "../../enums/enums";

function RentalHistoryTable({rentals, email}) {

  return (
    <div className={`admin-rentals-table ${!email ? "no-email" : ""}`}>
      <table className="admin-rentals-table-content">

        <thead>
          <tr>
            {email && <th>Email</th>}
            <th>Address</th>
            <th>Number of days</th>
            <th>Payment method</th>
            <th>Total price</th>
            <th>Rented at</th>
            <th>Pet/Special package</th>
          </tr>
        </thead>
        <tbody>
          {rentals.length === 0 ? (
            <tr>
              <td colSpan="7" className="admin-no-rentals">
                No rental history found.
              </td>
            </tr>
          ) : (
            rentals.map((rental) => (
   

              <tr key={rental.id}>
                {email && <td className="admin-rent-email">{rental.user.email}</td>}
                <td className="admin-rent-address">{rental.address}</td>
                <td className="admin-rent-days">{rental.numberOfDays}</td>
                <td className="admin-rent-payment-method">
                  {PaymentMethodEnum[rental.paymentMethod] ?? 'Unknown'}
                </td>
                <td className="admin-rent-total-price">{rental.totalPrice} €</td>
                <td className="admin-rent-date">{new Date(rental.rentalDate).toLocaleString()}</td>
                <td className="admin-rent-pet">

                {rental.specialPackage?.specialPackagePets?.length > 0 ?(
                <Link to={`/package-details/${rental.specialPackage.id}`}>

                  <div className="special-package-pets-images">
                    {rental.specialPackage.specialPackagePets.map(({ pet }) => (
                      <img
                        key={pet.id}
                        src={pet.imageUrl}
                        alt={pet.name}
                        className="admin-rent-pet-image"
                        title={pet.name}
                      />
                    ))}
                  </div>
                </Link>
  ) : rental.pet ? (
   
    <Link to={`/pet/${rental.pet.id}`} className="admin-rent-link">
      <img
        src={rental.pet.imageUrl || "/images/default-pet.jpg"}
        alt=""
        className="admin-rent-pet-image"
      />
    </Link>
  ) : (
    <div>No data</div>
  )}
              </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default RentalHistoryTable;
