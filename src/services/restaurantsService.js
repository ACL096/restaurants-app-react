import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase/config";

// Referencia a la colección de restaurantes
const restaurantsCollection = collection(db, "restaurants");

/**
 * Agrega un nuevo restaurante a Firestore
 * @param {Object} restaurantData - Datos del restaurante
 * @returns {Promise} - Promesa con el resultado
 */
export const addRestaurant = async (restaurantData) => {
  try {
    console.log("🚀 Enviando datos a Firebase...");
    
    // Preparar datos para Firebase
    const firebaseData = {
      name: restaurantData.name.trim(),
      description: restaurantData.description.trim(),
      address: restaurantData.address.trim(),
      image: restaurantData.image.trim(),
      category: restaurantData.category,
      priceRange: restaurantData.priceRange,
      rating: parseFloat(restaurantData.rating),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    console.log("📤 Datos a guardar:", firebaseData);
    
    // Guardar en Firestore
    const docRef = await addDoc(restaurantsCollection, firebaseData);
    
    console.log("✅ Documento creado con ID:", docRef.id);
    
    return { 
      success: true, 
      id: docRef.id,
      message: "¡Restaurante guardado exitosamente en Firebase!" 
    };
    
  } catch (error) {
    console.error("❌ Error al guardar en Firebase:", error);
    
    // Mejorar mensajes de error
    let errorMessage = `Error: ${error.message}`;
    
    if (error.code === 'permission-denied') {
      errorMessage = "Permiso denegado. Verifica las reglas de Firestore.";
    } else if (error.code === 'not-found') {
      errorMessage = "Proyecto o colección no encontrados.";
    } else if (error.message.includes('network')) {
      errorMessage = "Error de red. Verifica tu conexión a internet.";
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Obtiene todos los restaurantes de Firestore
 * @returns {Promise<Array>} - Array de restaurantes
 */
export const getRestaurants = async () => {
  try {
    const q = query(restaurantsCollection, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const restaurants = [];
    querySnapshot.forEach((doc) => {
      restaurants.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log(`✅ ${restaurants.length} restaurantes cargados desde Firebase`);
    return restaurants;
    
  } catch (error) {
    console.error("❌ Error al cargar restaurantes:", error);
    throw new Error(`Error al cargar: ${error.message}`);
  }
};

/**
 * Obtiene restaurantes filtrados
 */
export const getFilteredRestaurants = async (searchTerm = "", category = "Todos", priceRange = "all") => {
  try {
    const allRestaurants = await getRestaurants();
    
    return allRestaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === "Todos" || restaurant.category === category;
      const matchesPrice = priceRange === "all" || restaurant.priceRange === priceRange;
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
  } catch (error) {
    console.error("Error al filtrar restaurantes:", error);
    throw error;
  }
};