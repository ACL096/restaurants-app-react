import React from 'react';

const RestaurantCard = ({ restaurant }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-warning"></i>);
    }

    return stars;
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card restaurant-card h-100">
        <img 
          src={restaurant.image} 
          className="card-img-top restaurant-image" 
          alt={restaurant.name}
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title">{restaurant.name}</h5>
          </div>
          <p className="card-text">{restaurant.description}</p>
          <div className="mt-auto">
            <p className="card-text">
              <small className="text-muted">
                <i className="fas fa-map-marker-alt me-1"></i>
                {restaurant.address}
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
