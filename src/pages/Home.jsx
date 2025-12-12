import React from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantsData } from '../data/restaurantsData';

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">Descubre los mejores restaurantes de Cali</h1>
              <p className="lead">
                Explora nuestra sección de restaurantes y encuentra tu próxima experiencia culinaria.
              </p>
              <a href="/search" className="btn btn-light btn-lg mt-3">
                Buscar restaurantes
              </a>
            </div>
            <div className="col-lg-6 text-center">
              <img 
                src="https://i.pinimg.com/736x/a0/41/21/a041210c2076df31cbe89cf842c3bfab.jpg" 
                alt="Restaurante elegante" 
                className="img-fluid rounded hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h2 className="text-center mb-4">Nuestros Restaurantes</h2>
            </div>
          </div>
          <div className="row">
            {restaurantsData.map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;