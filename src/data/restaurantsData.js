export const restaurantsData = [
  {
        id: 1,
        name: "Cantina la 15",
        description: "Embajadores oficiales de la cocina mexicana en Colombia",
        address: "Calle 15 norte #9N-62, Granada",
        image: "https://i.pinimg.com/1200x/8d/51/e9/8d51e9ced1aad8f8233f3cf5e813ebba.jpg"
    },
    {
        id: 2,
        name: "El buen Nino",
        description: "Una pequeña Italia en Cali",
        address: "Avenida 9 norte # 15AN 41, Granada",
        image: "https://i.pinimg.com/736x/3c/a8/29/3ca8298cda2596e80df0272e69e24808.jpg"
    },
    {
        id: 3,
        name: "Sushi Green",
        description: "Comida Asiática, wok & teppan",
        address: "Carrera 34 # 3a 79, parque del perro",
        image: "https://i.pinimg.com/736x/e3/0c/62/e30c627d87b07e1691f4220af63705a2.jpg"
    },
    {
        id: 4,
        name: "Roman Steak House",
        description: "Tenemos una parrilla y sabemos como usarla |vinos| amigos|momentos",
        address: "Calle 3a # 34 57, parque del perro",
        image: "https://i.pinimg.com/1200x/f8/52/81/f85281fbe1e0ce671ee15ea035c5a8c2.jpg"
    }
];

export const priceRanges = [
  { value: "all", label: "Todos los precios" },
  { value: "$", label: "$ (Económico)" },
  { value: "$$", label: "$$ (Moderado)" },
  { value: "$$$", label: "$$$ (Alto)" }
];

export const categories = [
  "Todos",
  "Italiana",
  "Parrilla",
  "Mexicana",
  "Asiática",
];

export const getRestaurants = () => {
  try {
    const savedRestaurants = JSON.parse(localStorage.getItem('restaurants')) || [];
    const allRestaurants = [...restaurantsData];
    
    savedRestaurants.forEach(savedRestaurant => {
      if (!allRestaurants.some(r => r.id === savedRestaurant.id)) {
        allRestaurants.push(savedRestaurant);
      }
    });
    
    return allRestaurants;
  } catch (error) {
    console.error('Error al cargar restaurantes:', error);
    return restaurantsData;
  }
};