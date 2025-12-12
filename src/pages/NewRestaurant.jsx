import React, { useState } from 'react';
import { categories, priceRanges } from '../data/restaurantsData';

const NewRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    image: '',
    category: categories[1], 
    priceRange: priceRanges[1].value, 
    rating: 4.0
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es requerida';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Ingresa una URL válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      
      console.log('Datos del restaurante:', formData);
      
      setShowSuccess(true);
      
      setTimeout(() => {
        setFormData({
          name: '',
          description: '',
          address: '',
          image: '',
          category: categories[1],
          priceRange: priceRanges[1].value,
          rating: 4.0
        });
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="text-center mb-4">Agregar Nuevo Restaurante</h2>
            
            {showSuccess && (
              <div className="alert alert-success alert-dismissible fade show" role="alert">
                <i className="fas fa-check-circle me-2"></i>
                ¡El restaurante ha sido agregado exitosamente!
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSuccess(false)}
                ></button>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Nombre del Restaurante</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ingresa el nombre del restaurante"
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">Descripción</label>
                <textarea 
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Descripción del restaurante"
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">Dirección</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Ingresa la dirección completa"
                />
                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">Categoría</label>
                  <select 
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categories.filter(cat => cat !== 'Todos').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="priceRange" className="form-label">Rango de Precio</label>
                  <select 
                    className="form-select"
                    id="priceRange"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                  >
                    {priceRanges.filter(range => range.value !== 'all').map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">URL de la Imagen</label>
                <input 
                  type="url" 
                  className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.image && <div className="invalid-feedback">{errors.image}</div>}
                <div className="form-text">Ingresa la URL de una imagen del restaurante.</div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-primary btn-lg">
                  <i className="fas fa-plus me-2"></i>
                  Agregar Restaurante
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewRestaurant;