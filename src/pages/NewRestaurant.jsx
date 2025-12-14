import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, priceRanges } from '../data/restaurantsData';
import { addRestaurant } from '../services/restaurantsService';

const NewRestaurant = () => {
  const navigate = useNavigate();
  
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ 
    type: '', // 'success', 'error', 'warning'
    message: '',
    details: ''
  });
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitorear conexión a internet
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Validaciones del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no puede exceder 100 caracteres';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La descripción no puede exceder 500 caracteres';
    }

    // Validar dirección
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    // Validar URL de imagen
    if (!formData.image.trim()) {
      newErrors.image = 'La URL de la imagen es requerida';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Ingresa una URL válida (debe comenzar con http:// o https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
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

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar conexión a internet
    if (!isOnline) {
      setSubmitStatus({
        type: 'error',
        message: 'Sin conexión a internet',
        details: 'Conéctate a internet para guardar restaurantes en Firebase'
      });
      return;
    }

    // Validar formulario
    if (!validateForm()) {
      setSubmitStatus({
        type: 'error',
        message: 'Corrige los errores del formulario',
        details: 'Revisa los campos marcados en rojo'
      });
      
      // Enfocar el primer campo con error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const input = document.querySelector(`[name="${firstErrorField}"]`);
        if (input) input.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '', details: '' });

    try {
      // Intentar guardar en Firebase
      const result = await addRestaurant(formData);
      
      // Éxito
      setSubmitStatus({
        type: 'success',
        message: '¡Restaurante creado exitosamente!',
        details: `ID: ${result.id} - Guardado en Firebase Firestore`
      });

      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        address: '',
        image: '',
        category: categories[1],
        priceRange: priceRanges[1].value,
        rating: 4.0
      });

      // Redirigir después de 3 segundos (opcional)
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error al guardar:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al guardar el restaurante';
      let errorDetails = error.message || 'Error desconocido';

      if (error.code === 'permission-denied') {
        errorMessage = 'Permiso denegado';
        errorDetails = 'Verifica las reglas de seguridad en Firebase Console';
      } else if (error.code === 'not-found') {
        errorMessage = 'Proyecto no encontrado';
        errorDetails = 'Verifica tu configuración de Firebase';
      } else if (!isOnline) {
        errorMessage = 'Perdiste la conexión a internet';
        errorDetails = 'Conéctate y vuelve a intentar';
      }

      setSubmitStatus({
        type: 'error',
        message: errorMessage,
        details: errorDetails
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      description: '',
      address: '',
      image: '',
      category: categories[1],
      priceRange: priceRanges[1].value,
      rating: 4.0
    });
    setErrors({});
    setSubmitStatus({ type: '', message: '', details: '' });
  };

  // URLs de imágenes de ejemplo
  const sampleImages = [
    { label: 'Restaurante', url: 'https://pinterest.com/photo-1565299624946-b28f40a0ca4b' },

  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Título y estado de conexión */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">
              <i className="fas fa-plus-circle text-primary me-2"></i>
              Agregar Nuevo Restaurante
            </h1>
            
            <div className={`badge ${isOnline ? 'bg-success' : 'bg-danger'} p-2`}>
              <i className={`fas fa-${isOnline ? 'wifi' : 'wifi-slash'} me-1`}></i>
              {isOnline ? 'Conectado a Firebase' : 'Sin conexión'}
            </div>
          </div>

          {/* Alertas de estado */}
          {submitStatus.type === 'success' && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-check-circle fa-2x"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="alert-heading">{submitStatus.message}</h4>
                  <p className="mb-0">{submitStatus.details}</p>
                  <hr />
                  <p className="mb-0 small">
                    Serás redirigido a la página principal en 3 segundos...
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSubmitStatus({ type: '', message: '', details: '' })}
              ></button>
            </div>
          )}

          {submitStatus.type === 'error' && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <div className="d-flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle fa-2x"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h4 className="alert-heading">{submitStatus.message}</h4>
                  <p className="mb-0">{submitStatus.details}</p>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setSubmitStatus({ type: '', message: '', details: '' })}
              ></button>
            </div>
          )}

          {!isOnline && (
            <div className="alert alert-warning">
              <div className="d-flex align-items-center">
                <i className="fas fa-wifi-slash fa-2x me-3"></i>
                <div>
                  <h5 className="alert-heading mb-1">Modo offline</h5>
                  <p className="mb-0">
                    No puedes crear restaurantes sin conexión a internet.
                    Los datos se guardan en <strong>Firebase Firestore</strong> y requieren conexión.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <div className="card shadow">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit} noValidate>
                {/* Nombre */}
                <div className="mb-4">
                  <label htmlFor="name" className="form-label fw-bold">
                    Nombre del Restaurante <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? 'is-invalid' : ''}`}
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej: La Trattoria Italiana"
                    disabled={isSubmitting || !isOnline}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.name}
                    </div>
                  )}
                  <div className="form-text">
                    Nombre único y descriptivo del restaurante
                  </div>
                </div>

                {/* Descripción */}
                <div className="mb-4">
                  <label htmlFor="description" className="form-label fw-bold">
                    Descripción <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe el restaurante, tipo de comida, ambiente especial, etc."
                    disabled={isSubmitting || !isOnline}
                    maxLength="500"
                    required
                  ></textarea>
                  {errors.description && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.description}
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-1">
                    <div className="form-text">
                      Mínimo 10 caracteres
                    </div>
                    <div className="form-text">
                      {formData.description.length}/500 caracteres
                    </div>
                  </div>
                </div>

                {/* Dirección */}
                <div className="mb-4">
                  <label htmlFor="address" className="form-label fw-bold">
                    Dirección <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Ej: Calle 45 #12-34, Medellín, Antioquia"
                    disabled={isSubmitting || !isOnline}
                    required
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.address}
                    </div>
                  )}
                  <div className="form-text">
                    Dirección completa para que los clientes te encuentren
                  </div>
                </div>

                {/* Categoría y Precio en una fila */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <label htmlFor="category" className="form-label fw-bold">
                      Categoría <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={isSubmitting || !isOnline}
                      required
                    >
                      {categories
                        .filter(cat => cat !== 'Todos')
                        .map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                    <div className="form-text">
                      Tipo de cocina del restaurante
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="priceRange" className="form-label fw-bold">
                      Rango de Precio <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="priceRange"
                      name="priceRange"
                      value={formData.priceRange}
                      onChange={handleChange}
                      disabled={isSubmitting || !isOnline}
                      required
                    >
                      {priceRanges
                        .filter(range => range.value !== 'all')
                        .map(range => (
                          <option key={range.value} value={range.value}>
                            {range.label}
                          </option>
                        ))}
                    </select>
                    <div className="form-text">
                      $ = Económico, $$ = Moderado, $$$ = Alto
                    </div>
                  </div>
                </div>

                {/* URL de Imagen */}
                <div className="mb-4">
                  <label htmlFor="image" className="form-label fw-bold">
                    URL de la Imagen <span className="text-danger">*</span>
                  </label>
                  <input
                    type="url"
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen-restaurante.jpg"
                    disabled={isSubmitting || !isOnline}
                    required
                  />
                  {errors.image && (
                    <div className="invalid-feedback">
                      <i className="fas fa-exclamation-circle me-1"></i>
                      {errors.image}
                    </div>
                  )}
                  
                  {/* Imágenes de ejemplo */}
                  <div className="mt-2">
                    <small className="text-muted d-block mb-2">
                      Ejemplos de URLs válidas:
                    </small>
                    <div className="d-flex flex-wrap gap-2">
                      {sampleImages.map((img, index) => (
                        <button
                          key={index}
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setFormData(prev => ({ ...prev, image: img.url }))}
                          disabled={isSubmitting || !isOnline}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calificación con slider */}
                <div className="mb-5">
                  <label htmlFor="rating" className="form-label fw-bold">
                    Calificación Inicial
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      type="range"
                      className="form-range flex-grow-1 me-3"
                      id="rating"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.5"
                      value={formData.rating}
                      onChange={handleChange}
                      disabled={isSubmitting || !isOnline}
                    />
                    <div className="text-center">
                      <div className="display-6 text-warning">
                        {formData.rating} <i className="fas fa-star"></i>
                      </div>
                      <small className="text-muted">Desliza para ajustar</small>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleClearForm}
                      disabled={isSubmitting || !isOnline}
                    >
                      <i className="fas fa-eraser me-2"></i>
                      Limpiar Formulario
                    </button>
                    
                    <button
                      type="button"
                      className="btn btn-outline-info ms-2"
                      onClick={() => navigate('/')}
                    >
                      <i className="fas fa-arrow-left me-2"></i>
                      Volver al Inicio
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg px-5"
                    disabled={isSubmitting || !isOnline}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Guardando en Firebase...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt me-2"></i>
                        Guardar en Firebase
                      </>
                    )}
                  </button>
                </div>

                {/* Nota informativa */}
                <div className="mt-4 pt-3 border-top">
                  <div className="alert alert-info mb-0">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-info-circle fa-lg me-3"></i>
                      <div>
                        <strong>Información importante:</strong>
                        <p className="mb-0">
                          Los datos se guardarán en <strong>Firebase Firestore</strong> y serán accesibles 
                          desde cualquier dispositivo con conexión a internet. 
                          {!isOnline && ' Actualmente estás offline.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRestaurant;