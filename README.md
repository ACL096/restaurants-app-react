# Restaurants App - Directorio Web con Firebase

## Descripción del Proyecto
Aplicación web dinámica desarrollada con React y Firebase que permite gestionar un directorio de restaurantes con persistencia en la nube.

## Tecnologías Utilizadas
- **Frontend**: React 18, React Router DOM, Bootstrap 5
- **Backend**: Firebase Firestore (NoSQL Database)
- **Hosting**: Firebase Hosting (opcional)
- **Icons**: Font Awesome

## Características Principales
- ✅ **Persistencia real en la nube** con Firebase Firestore
- ✅ **CRUD completo**: Crear, Leer restaurantes
- ✅ **Búsqueda avanzada**: Filtros en tiempo real
- ✅ **Manejo de estado**: Hooks de React (useState, useEffect)
- ✅ **Validaciones**: En tiempo real en formularios
- ✅ **Loading states**: Indicadores de carga
- ✅ **Manejo de errores**: Conexión perdida, errores de Firestore
- ✅ **Diseño responsive**: Mobile-first approach

## Configuración de Firebase

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto llamado `restaurants-app-react`
3. Registra una aplicación web
4. Copia las credenciales de configuración

### 2. Configurar Firestore Database
1. En Firebase Console, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona modo "Producción" o "Pruebas"
4. Elige una región cercana
5. Habilitar las reglas en modo prueba (para desarrollo):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}