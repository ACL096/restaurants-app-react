import React, { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { getRestaurants } from '../services/restaurantsService';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadRestaurants = async (retry = 0) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (error) {
      console.error('Error al cargar restaurantes:', error);
      setError(error.message);
      
      if (retry < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          loadRestaurants(retry + 1);
        }, 2000 * (retry + 1));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
    
    const handleOnline = () => {
      if (error) {
        loadRestaurants();
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (isLoading && restaurants.length === 0) {
    return (
      <>
        {/* Hero Section (mientras carga) */}
        <section className="hero-section bg-primary text-white py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 fw-bold">Cargando restaurantes...</h1>
                <p className="lead">
                  Conectando con Firebase Firestore
                </p>
              </div>
              <div className="col-lg-6 text-center">
                <div className="spinner-border text-light" style={{width: '3rem', height: '3rem'}} role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Loading Section */}
        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h3>Cargando desde la nube...</h3>
                <p className="text-muted">
                  {retryCount > 0 && `Reintento ${retryCount} de 3...`}
                </p>
                <div className="progress mt-3" style={{height: '4px'}}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated" 
                    style={{width: `${25 * (retryCount + 1)}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <>
        <section className="hero-section bg-danger text-white py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="display-4 fw-bold">Error de conexión</h1>
                <p className="lead">
                  No se pueden cargar los restaurantes desde Firebase
                </p>
                <div className="mt-4">
                  <button 
                    className="btn btn-light btn-lg me-3"
                    onClick={() => loadRestaurants()}
                  >
                    <i className="fas fa-redo me-2"></i>
                    Reintentar
                  </button>
                  <a href="/new-restaurant" className="btn btn-outline-light btn-lg">
                    <i className="fas fa-plus me-2"></i>
                    Agregar localmente
                  </a>
                </div>
              </div>
              <div className="col-lg-6 text-center">
                <i className="fas fa-cloud-slash fa-5x"></i>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 text-center">
                <div className="alert alert-danger">
                  <h4><i className="fas fa-exclamation-triangle me-2"></i>Error</h4>
                  <p>{error}</p>
                  <p className="mb-0">
                    Verifica tu conexión a internet y asegúrate de que Firebase esté configurado correctamente.
                  </p>
                </div>
                
                <div className="card mt-4">
                  <div className="card-body">
                    <h5 className="card-title">Soluciones posibles:</h5>
                    <ul className="text-start">
                      <li>Verifica tu conexión a internet</li>
                      <li>Revisa la configuración de Firebase</li>
                      <li>Intenta recargar la página</li>
                      <li>Contacta al administrador</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold">Descubre los mejores restaurantes de Cali</h1>
              <p className="lead">
                {restaurants.length} restaurantes cargados desde Firebase
                {!navigator.onLine && (
                  <span className="badge bg-warning text-dark ms-2">
                    <i className="fas fa-wifi-slash me-1"></i>
                    Sin conexión
                  </span>
                )}
              </p>
              <div className="mt-3">
                <a href="/search" className="btn btn-light btn-lg me-3">
                  <i className="fas fa-search me-2"></i>
                  Buscar restaurantes
                </a>
                <a href="/new-restaurant" className="btn btn-outline-light btn-lg">
                  <i className="fas fa-plus me-2"></i>
                  Nuevo restaurante
                </a>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              {isLoading ? (
                <div className="spinner-border text-light" style={{width: '3rem', height: '3rem'}} role="status">
                  <span className="visually-hidden">Actualizando...</span>
                </div>
              ) : (
                <img 
                  src="https://i.pinimg.com/736x/c8/58/50/c858508d6d9d0a38c0aa85fc7d469056.jpg" 
                  alt="Restaurante" 
                  className="img-fluid rounded hero-image"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-0">Nuestros Restaurantes</h2>
                {isLoading && (
                  <div className="d-flex align-items-center">
                    <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                      <span className="visually-hidden">Actualizando...</span>
                    </div>
                    <small className="text-muted">Actualizando...</small>
                  </div>
                )}
              </div>
              <p className="text-muted">
                Datos en tiempo real desde Firebase Firestore
              </p>
            </div>
          </div>
          
          {restaurants.length === 0 && !isLoading ? (
            <div className="text-center py-5">
              <i className="fas fa-utensils fa-4x text-muted mb-3"></i>
              <h4 className="text-muted">No hay restaurantes registrados</h4>
              <p className="text-muted">Sé el primero en agregar un restaurante</p>
              <a href="/new-restaurant" className="btn btn-primary btn-lg mt-3">
                <i className="fas fa-plus me-2"></i>
                Agregar Restaurante
              </a>
            </div>
          ) : (
            <>
              <div className="row">
                {restaurants.map(restaurant => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
              
              {/* Botón para actualizar manualmente */}
              <div className="text-center mt-5">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => loadRestaurants()}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt me-2"></i>
                      Actualizar lista
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;