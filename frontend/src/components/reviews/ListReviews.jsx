import React from 'react'
import StarRatings from 'react-star-ratings'

export default function ListReviews({reviews}){
  return (
    <div classNameName="reviews w-75">
    <h3>Other's Reviews:</h3>
    <hr />
    {reviews.map(review => <div classNameName="review-card my-3">
      <div classNameName="row" key={review?._id}>
        <div classNameName="col-1">
          <img
              src={review?.user?.avatar ? review?.user?.avatar?.url : '../images/default_avatar.jpg'}
            alt="User Name"
            width="50"
            height="50"
            classNameName="rounded-circle"
          />
        </div>
        <div classNameName="col-11">
        <StarRatings
            rating={review?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="22px"
            starSpacing="1px"
            changeRating={e => setRatings(e)}
          />
          <p classNameName="review_user">by {review?.user?.name}</p>
          <p classNameName="review_comment">{review?.comment}</p>
        </div>
      </div>
      <hr />
    </div>)}
      </div>
  )
}
