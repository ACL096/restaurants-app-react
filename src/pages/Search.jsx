import React, { useState, useEffect, useMemo } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { getFilteredRestaurants } from '../services/restaurantsService';
import { priceRanges, categories } from '../data/restaurantsData';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await getFilteredRestaurants(searchTerm, selectedCategory, selectedPrice);
        
        let sortedData = [...data];
        if (sortBy === 'rating') {
          sortedData.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'name') {
          sortedData.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setFilteredRestaurants(sortedData);
      } catch (error) {
        console.error('Error al cargar restaurantes:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchRestaurants();
    }, 300); // 300ms de delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedPrice, selectedCategory, sortBy]);

  return (
    <>
      {/* Search Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center mb-4">Buscar Restaurantes</h2>
              
              {/* Barra de búsqueda */}
              <div className="input-group mb-4">
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="Buscar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  {isLoading ? (
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                  ) : (
                    <i className="fas fa-search"></i>
                  )}
                </span>
              </div>

              {/* Filtros */}
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Rango de Precio</label>
                  <select 
                    className="form-select"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                    disabled={isLoading}
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Categoría</label>
                  <select 
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    disabled={isLoading}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label className="form-label">Ordenar por</label>
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="name">Nombre</option>
                    <option value="rating">Calificación</option>
                  </select>
                </div>
              </div>
              
              {/* Indicador de conexión */}
              {!navigator.onLine && (
                <div className="alert alert-warning mt-3 mb-0" role="alert">
                  <i className="fas fa-wifi-slash me-2"></i>
                  Estás trabajando sin conexión. Los datos mostrados pueden no estar actualizados.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">
                  {isLoading ? 'Buscando...' : `${filteredRestaurants.length} Restaurantes Encontrados`}
                </h3>
                
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show py-2" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    Error: {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <h4 className="text-muted">Buscando en Firebase...</h4>
              <p className="text-muted">Cargando restaurantes desde la nube</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
              <h4 className="text-danger">Error al cargar datos</h4>
              <p className="text-muted">{error}</p>
              <button 
                className="btn btn-primary mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                Reintentar
              </button>
            </div>
          ) : filteredRestaurants.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No se encontraron restaurantes</h4>
              <p className="text-muted">Intenta con otros criterios de búsqueda</p>
              <button 
                className="btn btn-outline-primary mt-3"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedPrice('all');
                  setSelectedCategory('Todos');
                }}
              >
                <i className="fas fa-redo me-2"></i>
                Restablecer filtros
              </button>
            </div>
          ) : (
            <div className="row">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Search;