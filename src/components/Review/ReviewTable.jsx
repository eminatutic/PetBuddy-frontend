import React from "react";
import "./ReviewTable.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons';


function ReviewTable({ reviews, onApprove, onDelete, isPendingView, showEmailUsername= true }) {

return (
  <div className="admin-reviews-table">
    <table className="admin-reviews-table-content">
      <thead>
        <tr>
          {showEmailUsername && <th>Email & Username</th>} 
          <th>Comment & Rating</th>
          <th>Posted at</th>
          <th>Pet</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {reviews.length === 0 ? (
          <tr>
            <td colSpan={showEmailUsername ? "6" : "5"} className="admin-no-reviews">
              No reviews found.
            </td>
          </tr>
        ) : (
          reviews.map((review) => (
            <tr key={review.id}>
              {showEmailUsername && (
                <td className="admin-review-email-username">
                  {review.user.email} <br />
                  {review.user.userName}
                </td>
              )}
              <td className="admin-review-comment-rating">
                <strong>Comment:</strong> {review.comment} <br />
                <strong>Rating: </strong>
                    {[...Array(5)].map((_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < review.rating ? solidStar : regularStar}
                        style={{ color: index < review.rating ? "gold" : "lightgray" }}
                      />
                    ))}

              </td>
              <td className="admin-review-time">
                {new Date(review.cTime).toLocaleString()}
              </td>
             <td className="admin-review-pet">
              <div className="admin-pet-wrapper">
                <img
                  src={review.pet?.imageUrl || "/images/default-pet.jpg"}
                  alt={review.pet?.name}
                  className="admin-pet-image"
                />
                <div className="admin-pet-name">{review.pet?.name}</div>
              </div>
            </td>

              <td className="admin-review-status">{review.status}</td>
              <td className="admin-review-actions">
                {isPendingView && (
                  <>
                    <Button
                      className="admin-approve-btn"
                      onClick={() => onApprove(review.id)}
                      text="Approve"
                    />
                    <Button
                      className="admin-delete-btn"
                      onClick={() => onDelete(review.id)}
                      text="Delete"
                    />
                  </>
                )}
                {!isPendingView && (
                  <Button
                      className="admin-delete-btn"
                      onClick={() => onDelete(review.id)}
                      text="Delete"
                  />
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

export default ReviewTable;
