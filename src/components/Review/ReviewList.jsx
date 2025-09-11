import React from 'react';
import './ReviewList.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faTrashAlt, faStar as solidStar, faStar as regularStar } from '@fortawesome/free-solid-svg-icons'; 

function ReviewList({ reviews, pendingReviews, userId, handleDeleteClick, isAdminRole }) {

 
  const userPendingReviews = pendingReviews?.filter(review => review.userId === userId) || [];

  return (
    <div className="reviews-list">
      {userPendingReviews.length > 0 && (
        <>
          {userPendingReviews.map((pendingReview) => (
            <div key={pendingReview.id} className="review pending-review">
              <div className="review-header">
              <p><strong>Your pending review (awaiting approval):</strong></p>
                <p id="username"><strong>{pendingReview.userName}</strong></p>
                <FontAwesomeIcon
                  icon={faTrashAlt} 
                  className="delete-iconR"
                  onClick={() => handleDeleteClick(pendingReview.id)} 
                  title="Delete review"
                />
              </div>
              <p><strong>Rating:</strong> 
                {[...Array(5)].map((_, index) => (
                  <FontAwesomeIcon 
                    key={index} 
                    icon={index < pendingReview.rating ? solidStar : regularStar} 
                    style={{ color: index < pendingReview.rating ? "gold" : "lightgray" }} 
                  />
                ))}
              </p>
              <p><strong>Comment:</strong> {pendingReview.comment}</p>
              <p><strong>Date:</strong>  {new Date(pendingReview.cTime).toLocaleString()}</p>
            </div>
          ))}
        </>
      )}

     
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review">
            <div className="review-header">
              <p id="username"><strong>{review.userName}</strong></p>
              {(review.userId === userId || isAdminRole) && (
                <FontAwesomeIcon
                  icon={faTrashAlt} 
                  className="delete-iconR"
                  onClick={() => handleDeleteClick(review.id)} 
                  title="Delete review"
                />
              )}
            </div>
            <p><strong>Rating:</strong> 
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon 
                  key={index} 
                  icon={index < review.rating ? solidStar : regularStar} 
                  style={{ color: index < review.rating ? "gold" : "lightgray" }} 
                />
              ))}
            </p>
            <p><strong>Comment:</strong> {review.comment}</p>
            <p><strong>Date:</strong>   {new Date(review.cTime).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewList;
