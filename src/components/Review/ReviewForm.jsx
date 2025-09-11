import React from 'react';
import './ReviewForm.css'; 
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faStar } from '@fortawesome/free-solid-svg-icons'; 

function ReviewForm({ newReview, setNewReview, rating, setRating, handleReviewSubmit }) {
  return (
    <form onSubmit={handleReviewSubmit}>
      <textarea
        value={newReview}
        onChange={(e) => setNewReview(e.target.value)}
        placeholder="Write your review..."
        rows="4"
        className="review-input"
      />
      <div className="rating-container">
        <label>Rating:</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FontAwesomeIcon
              key={star}
              icon={faStar}
              className={`star-icon ${rating >= star ? 'selected' : ''}`}
              onClick={() => setRating(star)}
              style={{ color: rating >= star ? 'gold' : 'lightgray', cursor: 'pointer' }} 
            />
          ))}
        </div>
      </div>
      <Button
        className="submit-review-btn"
        text="Submit review"
        onClick={handleReviewSubmit}
      />
    </form>
  );
}

export default ReviewForm;
