import React, { useState, useMemo } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import { restaurantsData, priceRanges, categories } from '../data/restaurantsData';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');

  const filteredRestaurants = useMemo(() => {
    let filtered = restaurantsData.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedPrice === 'all' || restaurant.priceRange === selectedPrice) &&
      (selectedCategory === 'Todos' || restaurant.category === selectedCategory)
    );

     if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [searchTerm, selectedPrice, selectedCategory, sortBy]);

  return (
    <>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="text-center mb-4">Buscar Restaurantes</h2>
              
              <div className="input-group mb-4">
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  placeholder="Buscar por nombre" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
              </div>

              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Rango de Precio</label>
                  <select 
                    className="form-select"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
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
                  >
                    <option value="name">Nombre</option>
                    <option value="rating">Calificación</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <h3 className="text-center">
                {filteredRestaurants.length} Restaurantes Encontrados
              </h3>
            </div>
          </div>

          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h4 className="text-muted">No se encontraron restaurantes</h4>
              <p className="text-muted">Intenta nuevamente</p>
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